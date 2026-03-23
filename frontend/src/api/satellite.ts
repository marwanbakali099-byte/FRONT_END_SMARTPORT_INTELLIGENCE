import { apiClient, USE_MOCK, simulateDelay } from './client';
import { mockDetections } from '../mock';
import type { DetectionFeature } from '../types/models';

export async function getSatelliteDetections(): Promise<DetectionFeature[]> {
  if (USE_MOCK) {
    const satelliteFeats = mockDetections.features
      .filter((f) => f.properties.source === 'satellite')
      .slice(0, 10); // get only first 10 for grid
    return simulateDelay(satelliteFeats);
  }
  
  // Real endpoint when available
  const { data } = await apiClient.get<{features: DetectionFeature[]}>('/detections/?source=satellite');
  return data.features;
}
