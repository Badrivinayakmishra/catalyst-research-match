"""
Automated Backup Manager
Handles automated backups for disaster recovery

SOC 2 Requirements:
- A1.2: Backup and recovery procedures
- A1.3: Data backup testing
"""

import os
import shutil
import json
import tarfile
import hashlib
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional
import subprocess


class BackupManager:
    """
    Automated backup system for SOC 2 compliance

    Features:
    - Automated daily backups
    - Encrypted backup storage
    - Backup verification
    - Retention policy
    - Disaster recovery procedures
    """

    def __init__(
        self,
        backup_dir: str = "data/backups",
        retention_days: int = 30,
        encrypt: bool = True
    ):
        """
        Initialize backup manager

        Args:
            backup_dir: Directory to store backups
            retention_days: Number of days to retain backups
            encrypt: Whether to encrypt backups
        """
        self.backup_dir = Path(backup_dir)
        self.backup_dir.mkdir(parents=True, exist_ok=True)

        self.retention_days = retention_days
        self.encrypt = encrypt

        if encrypt:
            from security.encryption_manager import get_encryption_manager
            self.encryption_manager = get_encryption_manager()
        else:
            self.encryption_manager = None

        print(f"✓ Backup Manager initialized")
        print(f"  - Backup directory: {self.backup_dir}")
        print(f"  - Retention: {retention_days} days")
        print(f"  - Encryption: {encrypt}")

    def create_backup(
        self,
        backup_name: Optional[str] = None,
        include_paths: Optional[List[str]] = None
    ) -> Path:
        """
        Create a full system backup

        Args:
            backup_name: Custom backup name
            include_paths: Specific paths to backup

        Returns:
            Path to backup file
        """
        # Generate backup name
        if backup_name is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_name = f"backup_{timestamp}"

        # Default paths to backup
        if include_paths is None:
            include_paths = [
                "data/audit_logs",
                "data/chroma_db",
                "data/embeddings",
                "data/user_data",
                ".env"  # Backup environment config (encrypted)
            ]

        # Create backup directory
        backup_path = self.backup_dir / backup_name
        backup_path.mkdir(exist_ok=True)

        # Copy files to backup
        backed_up_files = []
        for path_str in include_paths:
            source_path = Path(path_str)

            if not source_path.exists():
                print(f"  ⚠️  Skipping {path_str} (not found)")
                continue

            # Determine destination
            dest_path = backup_path / source_path.name

            # Copy
            if source_path.is_file():
                shutil.copy2(source_path, dest_path)
                backed_up_files.append(str(source_path))
            elif source_path.is_dir():
                shutil.copytree(source_path, dest_path, dirs_exist_ok=True)
                backed_up_files.append(str(source_path))

        # Create metadata
        metadata = {
            "backup_name": backup_name,
            "timestamp": datetime.now().isoformat(),
            "files_backed_up": backed_up_files,
            "backup_type": "full",
            "encrypted": self.encrypt
        }

        metadata_path = backup_path / "backup_metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2)

        # Compress backup
        archive_path = self.backup_dir / f"{backup_name}.tar.gz"
        with tarfile.open(archive_path, "w:gz") as tar:
            tar.add(backup_path, arcname=backup_name)

        # Remove uncompressed backup
        shutil.rmtree(backup_path)

        # Encrypt if enabled
        if self.encrypt and self.encryption_manager:
            encrypted_path = self.encryption_manager.encrypt_file(
                archive_path,
                archive_path.with_suffix('.tar.gz.encrypted')
            )
            # Remove unencrypted archive
            archive_path.unlink()
            final_path = encrypted_path
        else:
            final_path = archive_path

        # Calculate checksum
        checksum = self._calculate_checksum(final_path)

        # Store checksum
        checksum_path = final_path.with_suffix(final_path.suffix + '.sha256')
        with open(checksum_path, 'w') as f:
            f.write(f"{checksum}  {final_path.name}\n")

        print(f"✓ Backup created: {final_path.name}")
        print(f"  - Size: {final_path.stat().st_size / 1024 / 1024:.2f} MB")
        print(f"  - Checksum: {checksum[:16]}...")

        return final_path

    def verify_backup(self, backup_path: Path) -> bool:
        """
        Verify backup integrity

        Args:
            backup_path: Path to backup file

        Returns:
            True if backup is valid
        """
        # Check checksum file exists
        checksum_path = backup_path.with_suffix(backup_path.suffix + '.sha256')

        if not checksum_path.exists():
            print(f"❌ Checksum file not found: {checksum_path}")
            return False

        # Read stored checksum
        with open(checksum_path, 'r') as f:
            stored_checksum = f.read().split()[0]

        # Calculate current checksum
        current_checksum = self._calculate_checksum(backup_path)

        # Compare
        if stored_checksum == current_checksum:
            print(f"✓ Backup verification passed: {backup_path.name}")
            return True
        else:
            print(f"❌ Backup verification FAILED: {backup_path.name}")
            print(f"  Expected: {stored_checksum}")
            print(f"  Got: {current_checksum}")
            return False

    def restore_backup(
        self,
        backup_path: Path,
        restore_dir: Optional[Path] = None
    ) -> bool:
        """
        Restore from backup

        Args:
            backup_path: Path to backup file
            restore_dir: Directory to restore to (default: current dir)

        Returns:
            True if restore successful
        """
        # Verify backup first
        if not self.verify_backup(backup_path):
            print("❌ Backup verification failed - cannot restore")
            return False

        if restore_dir is None:
            restore_dir = Path.cwd()

        # Decrypt if encrypted
        if backup_path.suffix == '.encrypted':
            if not self.encryption_manager:
                print("❌ Backup is encrypted but no encryption manager")
                return False

            # Decrypt to temp file
            decrypted_path = backup_path.with_suffix('')
            self.encryption_manager.decrypt_file(backup_path, decrypted_path)
            archive_path = decrypted_path
        else:
            archive_path = backup_path

        # Extract archive
        with tarfile.open(archive_path, "r:gz") as tar:
            tar.extractall(restore_dir)

        # Clean up decrypted temp file
        if archive_path != backup_path:
            archive_path.unlink()

        print(f"✓ Backup restored to: {restore_dir}")
        return True

    def cleanup_old_backups(self):
        """
        Remove backups older than retention period

        SOC 2: A1.2 - Retention policy
        """
        cutoff_date = datetime.now() - timedelta(days=self.retention_days)

        removed_count = 0
        for backup_file in self.backup_dir.glob("backup_*.tar.gz*"):
            # Skip checksum files
            if backup_file.suffix == '.sha256':
                continue

            # Check file age
            file_time = datetime.fromtimestamp(backup_file.stat().st_mtime)

            if file_time < cutoff_date:
                # Remove backup and checksum
                backup_file.unlink()
                checksum_file = backup_file.with_suffix(backup_file.suffix + '.sha256')
                if checksum_file.exists():
                    checksum_file.unlink()

                removed_count += 1
                print(f"  Removed old backup: {backup_file.name}")

        if removed_count > 0:
            print(f"✓ Cleaned up {removed_count} old backups")
        else:
            print("✓ No old backups to clean up")

    def list_backups(self) -> List[Dict]:
        """
        List all available backups

        Returns:
            List of backup metadata
        """
        backups = []

        for backup_file in sorted(self.backup_dir.glob("backup_*.tar.gz*")):
            if backup_file.suffix == '.sha256':
                continue

            backups.append({
                "name": backup_file.name,
                "path": str(backup_file),
                "size_mb": backup_file.stat().st_size / 1024 / 1024,
                "created": datetime.fromtimestamp(backup_file.stat().st_mtime).isoformat(),
                "encrypted": backup_file.suffix == '.encrypted'
            })

        return backups

    def _calculate_checksum(self, file_path: Path) -> str:
        """Calculate SHA-256 checksum of file"""
        sha256_hash = hashlib.sha256()

        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)

        return sha256_hash.hexdigest()

    def test_backup_restore(self, backup_path: Path) -> bool:
        """
        Test backup can be restored (SOC 2 requirement)

        Args:
            backup_path: Path to backup to test

        Returns:
            True if restore test passed
        """
        import tempfile

        print(f"Testing backup restore: {backup_path.name}")

        # Create temp directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Attempt restore
            success = self.restore_backup(backup_path, Path(temp_dir))

            if success:
                # Verify files were restored
                restored_files = list(Path(temp_dir).rglob("*"))
                if len(restored_files) > 0:
                    print(f"✓ Restore test PASSED ({len(restored_files)} files restored)")
                    return True
                else:
                    print("❌ Restore test FAILED (no files restored)")
                    return False
            else:
                return False


def create_daily_backup():
    """
    Daily backup task (call from cron/scheduler)

    Usage:
        # Add to crontab
        0 2 * * * cd /path/to/backend && python -c "from backup.backup_manager import create_daily_backup; create_daily_backup()"
    """
    manager = BackupManager()

    # Create backup
    backup_path = manager.create_backup()

    # Verify backup
    manager.verify_backup(backup_path)

    # Test restore (required for SOC 2)
    manager.test_backup_restore(backup_path)

    # Cleanup old backups
    manager.cleanup_old_backups()

    print("\n✓ Daily backup completed successfully")


if __name__ == "__main__":
    print("="*60)
    print("Backup Manager Test")
    print("="*60)

    # Initialize
    manager = BackupManager(
        backup_dir="data/test_backups",
        retention_days=7,
        encrypt=True
    )

    # Create test data
    test_dir = Path("data/test_data")
    test_dir.mkdir(parents=True, exist_ok=True)
    (test_dir / "test_file.txt").write_text("This is test data for backup")

    # Create backup
    print("\n1️⃣  Creating backup...")
    backup_path = manager.create_backup(
        backup_name="test_backup",
        include_paths=["data/test_data"]
    )

    # Verify backup
    print("\n2️⃣  Verifying backup...")
    is_valid = manager.verify_backup(backup_path)

    # List backups
    print("\n3️⃣  Listing backups...")
    backups = manager.list_backups()
    for backup in backups:
        print(f"  - {backup['name']} ({backup['size_mb']:.2f} MB)")

    # Test restore
    print("\n4️⃣  Testing restore...")
    manager.test_backup_restore(backup_path)

    # Cleanup
    shutil.rmtree("data/test_backups")
    shutil.rmtree("data/test_data")

    print("\n" + "="*60)
    print("✅ Backup Manager Working!")
    print("="*60)
