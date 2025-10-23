/**
 * ACCURACY SCORING - Converted from accuracy_scoring.py
 * Calculate accuracy and confidence scores for geolocation data
 */

export class AccuracyScorer {
  /**
   * Calculate accuracy for geolocation data
   */
  calculateAccuracy(geoData, threatData = {}) {
    const confidence = geoData.confidence || 0.7;
    
    // Calculate accuracy radius in km based on confidence
    let accuracyRadiusKm = 50; // Default
    if (confidence > 0.9) accuracyRadiusKm = 10;
    else if (confidence > 0.8) accuracyRadiusKm = 25;
    else if (confidence > 0.7) accuracyRadiusKm = 50;
    else accuracyRadiusKm = 100;
    
    return {
      accuracyRadiusKm,
      accuracyRadiusMiles: Math.round(accuracyRadiusKm * 0.621371),
      confidenceScore: Math.round(confidence * 100),
      dataQuality: confidence > 0.85 ? 'high' : confidence > 0.7 ? 'medium' : 'low',
      geolocationAccuracy: confidence > 0.9 ? 'precise' : 'approximate'
    };
  }
}

export const accuracyScorer = new AccuracyScorer();
