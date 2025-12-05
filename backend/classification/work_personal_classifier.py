"""
Work vs Personal Content Classifier
Uses Azure OpenAI (GPT-5) to classify documents as work-related or personal
SECURITY: All data sanitized before sending to Azure OpenAI
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from openai import AzureOpenAI
from tqdm import tqdm
import time
from collections import defaultdict

# SECURITY: Import data sanitizer and audit logger
from security.data_sanitizer import DataSanitizer
from security.audit_logger import get_audit_logger


class WorkPersonalClassifier:
    """Classifier to distinguish work-related from personal content"""

    def __init__(
        self,
        api_key: str = None,
        endpoint: str = None,
        deployment: str = None,
        api_version: str = "2024-02-15-preview",
        organization_id: str = None,
        user_id: str = "system"
    ):
        """
        Initialize classifier with Azure OpenAI

        Args:
            api_key: Azure OpenAI API key (or from env AZURE_OPENAI_API_KEY)
            endpoint: Azure OpenAI endpoint (or from env AZURE_OPENAI_ENDPOINT)
            deployment: Azure deployment name (or from env AZURE_OPENAI_DEPLOYMENT)
            api_version: Azure API version
            organization_id: Organization ID for audit logging
            user_id: User ID for audit logging
        """
        # Load from environment if not provided
        self.api_key = api_key or os.getenv('AZURE_OPENAI_API_KEY')
        self.endpoint = endpoint or os.getenv('AZURE_OPENAI_ENDPOINT')
        self.deployment = deployment or os.getenv('AZURE_OPENAI_DEPLOYMENT')
        self.api_version = api_version
        self.organization_id = organization_id
        self.user_id = user_id

        # Initialize Azure OpenAI client
        self.client = AzureOpenAI(
            api_key=self.api_key,
            api_version=self.api_version,
            azure_endpoint=self.endpoint
        )
        self.classification_results = []

        # SECURITY: Initialize data sanitizer
        self.sanitizer = DataSanitizer(max_length=1000)

        # SECURITY: Initialize audit logger
        self.audit_logger = get_audit_logger(organization_id=organization_id)

        print(f"✓ Initialized Azure OpenAI classifier (deployment: {self.deployment})")

    def classify_document(self, document: Dict) -> Dict:
        """
        Classify a single document as work or personal

        Args:
            document: Document dictionary with content and metadata

        Returns:
            Dictionary with classification results and confidence
        """
        content = document['content']
        subject = document['metadata'].get('subject', '')

        # SECURITY: Sanitize data before sending to OpenAI
        sanitized_subject = self.sanitizer.sanitize_text(subject, truncate=False)
        sanitized_content = self.sanitizer.sanitize_text(content, truncate=True)

        # Prepare classification prompt with SANITIZED data
        prompt = self._create_classification_prompt(sanitized_subject, sanitized_content)

        try:
            # Call Azure OpenAI for classification
            response = self.client.chat.completions.create(
                model=self.deployment,  # Azure uses deployment name
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at distinguishing work-related emails from personal emails. You analyze email content and provide accurate classifications with confidence scores."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,  # Low temperature for consistent classification
                max_tokens=100,
            )

            # Parse response
            result_text = response.choices[0].message.content.strip()
            classification_result = self._parse_classification_result(result_text)

            # Add to document
            document['classification'] = classification_result

            # SECURITY: Audit log successful LLM call
            self.audit_logger.log_classification(
                user_id=self.user_id,
                model_deployment=self.deployment,
                document_count=1,
                sanitized=True,
                success=True
            )

            return classification_result

        except Exception as e:
            print(f"Error classifying document: {e}")

            # SECURITY: Audit log failed LLM call
            self.audit_logger.log_llm_call(
                action="classification",
                model_deployment=self.deployment,
                user_id=self.user_id,
                sanitized=True,
                success=False,
                error=str(e)
            )

            # Default to uncertain if classification fails
            return {
                'category': 'uncertain',
                'confidence': 0.5,
                'reasoning': f'Classification failed: {str(e)}',
                'action': 'review'
            }

    def _create_classification_prompt(self, subject: str, content: str) -> str:
        """Create prompt for classification"""
        # Truncate content if too long
        max_content_length = 1000
        truncated_content = content[:max_content_length]
        if len(content) > max_content_length:
            truncated_content += "... [truncated]"

        prompt = f"""Classify the following email as either WORK or PERSONAL.

Subject: {subject}

Content:
{truncated_content}

Provide your response in the following JSON format:
{{
    "category": "work" or "personal",
    "confidence": <float between 0.0 and 1.0>,
    "reasoning": "<brief explanation>"
}}

Work emails include: business communications, project discussions, client interactions, internal company matters, technical discussions, meeting scheduling, formal communications.

Personal emails include: family matters, personal appointments, social invitations, personal shopping, personal travel, personal financial matters, casual conversations with friends.

Be conservative - when in doubt, classify as work if it could reasonably be work-related."""

        return prompt

    def _parse_classification_result(self, result_text: str) -> Dict:
        """Parse the LLM response into structured format"""
        try:
            # Try to parse as JSON
            if '{' in result_text and '}' in result_text:
                # Extract JSON portion
                start = result_text.index('{')
                end = result_text.rindex('}') + 1
                json_str = result_text[start:end]
                result = json.loads(json_str)

                category = result.get('category', '').lower()
                confidence = float(result.get('confidence', 0.5))
                reasoning = result.get('reasoning', '')

                # Determine action based on confidence
                if category == 'work' and confidence >= 0.85:
                    action = 'keep'
                elif category == 'personal' and confidence >= 0.85:
                    action = 'remove'
                else:
                    action = 'review'

                return {
                    'category': category,
                    'confidence': confidence,
                    'reasoning': reasoning,
                    'action': action
                }
        except Exception as e:
            print(f"Error parsing result: {e}")

        # Fallback
        return {
            'category': 'uncertain',
            'confidence': 0.5,
            'reasoning': 'Failed to parse classification',
            'action': 'review'
        }

    def classify_batch(
        self,
        documents: List[Dict],
        batch_delay: float = 0.1
    ) -> List[Dict]:
        """
        Classify a batch of documents

        Args:
            documents: List of documents to classify
            batch_delay: Delay between API calls to avoid rate limits

        Returns:
            List of documents with classification results
        """
        print(f"Classifying {len(documents)} documents...")

        classified_docs = []

        for doc in tqdm(documents, desc="Classifying"):
            classification = self.classify_document(doc)
            doc['classification'] = classification
            classified_docs.append(doc)

            # Rate limiting
            time.sleep(batch_delay)

        self.classification_results = classified_docs
        return classified_docs

    def filter_documents(
        self,
        documents: List[Dict]
    ) -> Tuple[List[Dict], List[Dict], List[Dict]]:
        """
        Filter documents into keep, remove, and review categories

        Args:
            documents: List of classified documents

        Returns:
            Tuple of (keep_docs, remove_docs, review_docs)
        """
        keep_docs = []
        remove_docs = []
        review_docs = []

        for doc in documents:
            classification = doc.get('classification', {})
            action = classification.get('action', 'review')

            if action == 'keep':
                keep_docs.append(doc)
            elif action == 'remove':
                remove_docs.append(doc)
            else:
                review_docs.append(doc)

        print(f"\nClassification Results:")
        print(f"  Keep (work): {len(keep_docs)}")
        print(f"  Remove (personal): {len(remove_docs)}")
        print(f"  Review (uncertain): {len(review_docs)}")

        return keep_docs, remove_docs, review_docs

    def save_classification_results(
        self,
        documents: List[Dict],
        output_dir: str
    ):
        """
        Save classification results to separate files

        Args:
            documents: Classified documents
            output_dir: Directory to save results
        """
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        # Filter documents
        keep_docs, remove_docs, review_docs = self.filter_documents(documents)

        # Save each category
        files_written = {}

        if keep_docs:
            keep_file = output_path / "work_documents.jsonl"
            with open(keep_file, 'w', encoding='utf-8') as f:
                for doc in keep_docs:
                    f.write(json.dumps(doc, ensure_ascii=False) + '\n')
            files_written['work'] = str(keep_file)
            print(f"✓ Saved {len(keep_docs)} work documents")

        if remove_docs:
            remove_file = output_path / "personal_documents.jsonl"
            with open(remove_file, 'w', encoding='utf-8') as f:
                for doc in remove_docs:
                    f.write(json.dumps(doc, ensure_ascii=False) + '\n')
            files_written['personal'] = str(remove_file)
            print(f"✓ Saved {len(remove_docs)} personal documents")

        if review_docs:
            review_file = output_path / "review_documents.jsonl"
            with open(review_file, 'w', encoding='utf-8') as f:
                for doc in review_docs:
                    f.write(json.dumps(doc, ensure_ascii=False) + '\n')
            files_written['review'] = str(review_file)
            print(f"✓ Saved {len(review_docs)} documents for review")

        # Save summary statistics
        summary = {
            'total_documents': len(documents),
            'work_documents': len(keep_docs),
            'personal_documents': len(remove_docs),
            'review_documents': len(review_docs),
            'files': files_written,
        }

        summary_file = output_path / "classification_summary.json"
        with open(summary_file, 'w', encoding='utf-8') as f:
            json.dump(summary, f, indent=2, ensure_ascii=False)

        print(f"✓ Saved classification summary to {summary_file}")


def classify_project_documents(
    project_dir: str,
    output_dir: str,
    api_key: str = None,
    endpoint: str = None,
    deployment: str = None,
    sample_size: Optional[int] = None
) -> WorkPersonalClassifier:
    """
    Classify documents in a project directory

    Args:
        project_dir: Directory containing project documents
        output_dir: Directory to save classified documents
        api_key: Azure OpenAI API key (optional, uses env)
        endpoint: Azure OpenAI endpoint (optional, uses env)
        deployment: Azure deployment name (optional, uses env)
        sample_size: Optional limit for testing

    Returns:
        WorkPersonalClassifier instance with results
    """
    classifier = WorkPersonalClassifier(
        api_key=api_key,
        endpoint=endpoint,
        deployment=deployment
    )

    # Load documents
    documents = []
    project_path = Path(project_dir)

    for jsonl_file in project_path.glob("**/*.jsonl"):
        with open(jsonl_file, 'r', encoding='utf-8') as f:
            for line in f:
                documents.append(json.loads(line))

    print(f"Loaded {len(documents)} documents from {project_dir}")

    # Sample if requested
    if sample_size and len(documents) > sample_size:
        import random
        documents = random.sample(documents, sample_size)
        print(f"Sampled {len(documents)} documents for classification")

    # Classify documents
    classified_docs = classifier.classify_batch(documents)

    # Save results
    classifier.save_classification_results(classified_docs, output_dir)

    return classifier


if __name__ == "__main__":
    from config.config import Config

    # Test classification
    classifier = classify_project_documents(
        project_dir=str(Config.DATA_DIR / "project_clusters"),
        output_dir=str(Config.DATA_DIR / "classified"),
        api_key=Config.OPENAI_API_KEY,
        sample_size=50  # Test with 50 documents
    )
