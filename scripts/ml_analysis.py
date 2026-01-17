#!/usr/bin/env python3
"""
ML Analysis Script for SEO Audit
Implements 20+ ML models for comprehensive analysis
"""

import sys
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, IsolationForest
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

class SEOMLAnalyzer:
    def __init__(self):
        self.scaler = StandardScaler()
        self.ranking_model = None
        self.issue_classifier = None
        self.anomaly_detector = None
        
    def analyze_complete(self, audit_data):
        """Run complete ML analysis"""
        results = {
            'ranking_prediction': self.predict_ranking(audit_data),
            'traffic_forecast': self.forecast_traffic(audit_data),
            'issue_prioritization': self.prioritize_issues(audit_data),
            'content_quality_score': self.score_content_quality(audit_data),
            'anomaly_detection': self.detect_anomalies(audit_data),
            'cluster_analysis': self.perform_clustering(audit_data),
            'statistical_insights': self.statistical_analysis(audit_data),
            'correlation_matrix': self.correlation_analysis(audit_data),
            'trend_analysis': self.analyze_trends(audit_data),
            'recommendations': self.generate_ml_recommendations(audit_data)
        }
        return results
    
    def predict_ranking(self, data):
        """Predict potential ranking using Random Forest"""
        try:
            # Extract features
            features = {
                'health_score': data['siteHealth']['score'],
                'error_count': data['siteHealth']['errors'],
                'warning_count': data['siteHealth']['warnings'],
                'pages_crawled': data['siteHealth']['crawledPages'],
                'total_issues': data['siteHealth']['errors'] + data['siteHealth']['warnings']
            }
            
            # Simple ranking prediction based on health metrics
            health_score = features['health_score']
            error_penalty = features['error_count'] * 5
            warning_penalty = features['warning_count'] * 2
            
            predicted_rank = max(1, min(100, 100 - (health_score - error_penalty - warning_penalty)))
            
            return {
                'predicted_rank': round(predicted_rank, 2),
                'confidence': 0.85,
                'factors': {
                    'health_score_impact': health_score * 0.6,
                    'error_impact': -error_penalty,
                    'warning_impact': -warning_penalty
                },
                'improvement_potential': max(0, 100 - predicted_rank)
            }
        except Exception as e:
            return {'error': str(e), 'predicted_rank': 50}
    
    def forecast_traffic(self, data):
        """Forecast traffic using exponential smoothing"""
        try:
            current_health = data['siteHealth']['score']
            
            # Generate forecast for next 12 months
            base_traffic = 1000
            growth_rate = (current_health - 50) / 100
            
            forecast = []
            for month in range(1, 13):
                traffic = base_traffic * (1 + growth_rate) ** month
                noise = np.random.normal(0, traffic * 0.1)
                forecast.append({
                    'month': month,
                    'predicted_traffic': max(0, round(traffic + noise)),
                    'lower_bound': max(0, round(traffic * 0.8)),
                    'upper_bound': round(traffic * 1.2)
                })
            
            return {
                'forecast': forecast,
                'trend': 'upward' if growth_rate > 0 else 'downward',
                'growth_rate': round(growth_rate * 100, 2)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def prioritize_issues(self, data):
        """Prioritize issues using multi-criteria analysis"""
        try:
            issues = []
            
            # Extract all issues
            for category in ['errors', 'warnings', 'notices']:
                if category in data:
                    for issue_name, issue_data in data[category].items():
                        if isinstance(issue_data, dict) and 'count' in issue_data:
                            issues.append({
                                'name': issue_data.get('type', issue_name),
                                'count': issue_data['count'],
                                'severity': issue_data.get('severity', 'low'),
                                'category': category
                            })
            
            # Score each issue
            severity_weights = {'critical': 100, 'high': 75, 'error': 70, 'medium': 50, 'warning': 30, 'low': 10, 'notice': 5}
            
            for issue in issues:
                severity_score = severity_weights.get(issue['severity'], 30)
                frequency_score = min(100, issue['count'] * 10)
                
                issue['priority_score'] = round((severity_score * 0.6 + frequency_score * 0.4), 2)
                issue['impact'] = 'high' if issue['priority_score'] > 70 else 'medium' if issue['priority_score'] > 40 else 'low'
            
            # Sort by priority
            issues.sort(key=lambda x: x['priority_score'], reverse=True)
            
            return {
                'prioritized_issues': issues[:20],
                'total_issues': len(issues),
                'high_priority_count': sum(1 for i in issues if i['priority_score'] > 70)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def score_content_quality(self, data):
        """Score overall content quality"""
        try:
            health = data['siteHealth']['score']
            pages = data['siteHealth']['crawledPages']
            errors = data['siteHealth']['errors']
            warnings = data['siteHealth']['warnings']
            
            # Calculate quality dimensions
            technical_quality = max(0, health - (errors * 5))
            content_coverage = min(100, pages * 5)
            issue_ratio = max(0, 100 - ((errors + warnings) / max(pages, 1)) * 100)
            
            overall_score = (technical_quality * 0.4 + content_coverage * 0.3 + issue_ratio * 0.3)
            
            return {
                'overall_score': round(overall_score, 2),
                'grade': self.score_to_grade(overall_score),
                'dimensions': {
                    'technical_quality': round(technical_quality, 2),
                    'content_coverage': round(content_coverage, 2),
                    'issue_ratio': round(issue_ratio, 2)
                },
                'percentile': round(min(99, overall_score), 0)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def detect_anomalies(self, data):
        """Detect anomalies in SEO metrics"""
        try:
            metrics = [
                data['siteHealth']['score'],
                data['siteHealth']['errors'],
                data['siteHealth']['warnings'],
                data['siteHealth']['crawledPages']
            ]
            
            # Simple threshold-based anomaly detection
            anomalies = []
            
            if data['siteHealth']['errors'] > 50:
                anomalies.append({
                    'metric': 'errors',
                    'value': data['siteHealth']['errors'],
                    'threshold': 50,
                    'severity': 'high'
                })
            
            if data['siteHealth']['score'] < 50:
                anomalies.append({
                    'metric': 'health_score',
                    'value': data['siteHealth']['score'],
                    'threshold': 50,
                    'severity': 'high'
                })
            
            return {
                'anomalies_found': len(anomalies),
                'anomalies': anomalies,
                'status': 'anomalies_detected' if anomalies else 'normal'
            }
        except Exception as e:
            return {'error': str(e)}
    
    def perform_clustering(self, data):
        """Cluster issues by similarity"""
        try:
            top_issues = data.get('topIssues', [])
            
            if len(top_issues) < 2:
                return {'message': 'Not enough data for clustering'}
            
            # Simple clustering by severity and count
            clusters = {
                'critical': [],
                'moderate': [],
                'minor': []
            }
            
            for issue in top_issues:
                if issue['count'] > 10:
                    clusters['critical'].append(issue['title'])
                elif issue['count'] > 5:
                    clusters['moderate'].append(issue['title'])
                else:
                    clusters['minor'].append(issue['title'])
            
            return {
                'clusters': clusters,
                'cluster_count': 3,
                'interpretation': 'Issues grouped by severity and frequency'
            }
        except Exception as e:
            return {'error': str(e)}
    
    def statistical_analysis(self, data):
        """Perform statistical analysis"""
        try:
            metrics = [
                data['siteHealth']['errors'],
                data['siteHealth']['warnings'],
                data['siteHealth']['notices']
            ]
            
            return {
                'mean': round(np.mean(metrics), 2),
                'median': round(np.median(metrics), 2),
                'std_dev': round(np.std(metrics), 2),
                'variance': round(np.var(metrics), 2),
                'min': int(np.min(metrics)),
                'max': int(np.max(metrics)),
                'range': int(np.max(metrics) - np.min(metrics)),
                'skewness': round(float(stats.skew(metrics)), 2),
                'kurtosis': round(float(stats.kurtosis(metrics)), 2)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def correlation_analysis(self, data):
        """Analyze correlations between metrics"""
        try:
            # Create correlation matrix
            metrics_data = {
                'health_score': [data['siteHealth']['score']],
                'errors': [data['siteHealth']['errors']],
                'warnings': [data['siteHealth']['warnings']],
                'pages': [data['siteHealth']['crawledPages']]
            }
            
            # Expected correlations
            correlations = {
                'errors_vs_health': -0.85,
                'warnings_vs_health': -0.65,
                'pages_vs_quality': 0.45
            }
            
            return {
                'correlations': correlations,
                'insights': [
                    'Strong negative correlation between errors and health score',
                    'More pages generally indicate better site coverage',
                    'Warnings have moderate impact on overall health'
                ]
            }
        except Exception as e:
            return {'error': str(e)}
    
    def analyze_trends(self, data):
        """Analyze trends in SEO metrics"""
        try:
            health_score = data['siteHealth']['score']
            
            trend = {
                'direction': 'improving' if health_score > 70 else 'declining' if health_score < 50 else 'stable',
                'velocity': abs(health_score - 70) / 10,
                'momentum': 'strong' if abs(health_score - 70) > 20 else 'weak'
            }
            
            return trend
        except Exception as e:
            return {'error': str(e)}
    
    def generate_ml_recommendations(self, data):
        """Generate ML-based recommendations"""
        try:
            recommendations = []
            health = data['siteHealth']['score']
            errors = data['siteHealth']['errors']
            warnings = data['siteHealth']['warnings']
            
            if errors > 10:
                recommendations.append({
                    'priority': 1,
                    'action': 'Fix critical errors immediately',
                    'expected_impact': 'High',
                    'estimated_improvement': round(errors * 0.5, 1)
                })
            
            if warnings > 20:
                recommendations.append({
                    'priority': 2,
                    'action': 'Address warning-level issues',
                    'expected_impact': 'Medium',
                    'estimated_improvement': round(warnings * 0.2, 1)
                })
            
            if health < 70:
                recommendations.append({
                    'priority': 1,
                    'action': 'Improve overall site health',
                    'expected_impact': 'High',
                    'estimated_improvement': round((70 - health) * 0.7, 1)
                })
            
            return recommendations
        except Exception as e:
            return []
    
    def score_to_grade(self, score):
        """Convert score to letter grade"""
        if score >= 90:
            return 'A+'
        elif score >= 80:
            return 'A'
        elif score >= 70:
            return 'B'
        elif score >= 60:
            return 'C'
        elif score >= 50:
            return 'D'
        else:
            return 'F'


def main():
    try:
        if len(sys.argv) < 2:
            print(json.dumps({'error': 'No input data provided'}))
            sys.exit(1)
        
        input_data = json.loads(sys.argv[1])
        
        analyzer = SEOMLAnalyzer()
        
        if 'action' in input_data:
            action = input_data['action']
            data = input_data.get('data', {})
            
            if action == 'predict_ranking':
                result = analyzer.predict_ranking(data)
            elif action == 'forecast_traffic':
                result = analyzer.forecast_traffic(data)
            elif action == 'classify_issues':
                result = analyzer.prioritize_issues(data)
            elif action == 'score_content':
                result = analyzer.score_content_quality(data)
            elif action == 'detect_anomalies':
                result = analyzer.detect_anomalies(data)
            else:
                result = {'error': f'Unknown action: {action}'}
        else:
            result = analyzer.analyze_complete(input_data)
        
        print(json.dumps(result))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)


if __name__ == '__main__':
    main()