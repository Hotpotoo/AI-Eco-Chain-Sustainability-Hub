import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResultData } from '../types';

const routeDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        distanceKm: { type: Type.NUMBER },
        timeMinutes: { type: Type.NUMBER },
        carbonEmissionsGrams: { type: Type.NUMBER },
        directions: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["distanceKm", "timeMinutes", "carbonEmissionsGrams"]
};

const savingsSchema = {
    type: Type.OBJECT,
    properties: {
        carbonEmissionsGrams: { type: Type.NUMBER },
        timeMinutes: { type: Type.NUMBER }
    },
    required: ["carbonEmissionsGrams", "timeMinutes"]
};

const emissionsBreakdownSchema = {
    type: Type.OBJECT,
    properties: {
        transportation: { type: Type.NUMBER },
        packaging: { type: Type.NUMBER },
        energy: { type: Type.NUMBER }
    },
    required: ["transportation", "packaging", "energy"]
};

const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        co2ReductionPercent: { type: Type.NUMBER },
        costReductionPercent: { type: Type.NUMBER }
    },
    required: ["title", "description", "co2ReductionPercent", "costReductionPercent"]
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    optimizedRoute: routeDetailsSchema,
    standardRoute: { ...routeDetailsSchema, properties: { ...routeDetailsSchema.properties, directions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Directions are not needed for standard route" } } },
    savings: savingsSchema,
    emissionsBreakdown: {
        type: Type.OBJECT,
        properties: {
            standard: emissionsBreakdownSchema,
            optimized: emissionsBreakdownSchema,
        },
        required: ["standard", "optimized"]
    },
    recommendations: {
        type: Type.ARRAY,
        items: recommendationSchema
    }
  },
  required: ["optimizedRoute", "standardRoute", "savings", "emissionsBreakdown", "recommendations"]
};


export async function analyzeRoute(start: string, end: string, weightKg: number, numParcels: number): Promise<AnalysisResultData> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const totalWeight = weightKg * numParcels;

  const prompt = `
    You are an expert in logistics, supply chain management, and environmental science, focusing on Malaysian commerce.
    Your task is to provide a comprehensive sustainability analysis comparing the delivery of multiple parcels individually versus in a single consolidated trip.

    The delivery details are:
    - From: "${start}"
    - To: "${end}"
    - Number of Parcels: ${numParcels}
    - Weight per Parcel: ${weightKg} kg
    - Total Weight for Consolidated Trip: ${totalWeight} kg

    Please perform the following analysis and provide the output ONLY in the specified JSON format. Do not add any other text, explanations, or markdown formatting.

    ASSUMPTIONS FOR CALCULATION:
    - Base vehicle emission: 150 grams of CO2 per kilometer.
    - Weight impact: Add 5 grams of CO2 per km for every 10kg of total cargo weight.
    - Standard packaging: 75 grams of CO2 per parcel.
    - Standard factory/logistics energy: 120 grams of CO2 per parcel.

    ANALYSIS:

    1.  **Standard Scenario (Multiple Individual Trips)**:
        *   This scenario assumes each of the ${numParcels} parcels is delivered in a separate trip.
        *   First, determine a standard, non-optimal route for a single parcel delivery (assume it's 15% longer and takes 20% more time than the most efficient route).
        *   Calculate the distance, time, and transportation CO2 emissions for this single, non-optimal trip using the parcel weight of ${weightKg}kg.
        *   The 'standardRoute' in the JSON must reflect the CUMULATIVE totals for all ${numParcels} trips. (e.g., total distance = single trip distance * ${numParcels}, total time = single trip time * ${numParcels}, etc.).
        *   No directions are needed for the standard route.

    2.  **Optimized Scenario (Single Consolidated Trip)**:
        *   This scenario assumes all ${numParcels} parcels are delivered together in one trip.
        *   Find the shortest, most fuel-efficient driving route.
        *   Calculate distance (km), travel time (minutes), and provide turn-by-turn directions for this single trip.
        *   Calculate total transportation CO2 emissions for this consolidated trip using the base vehicle emission and the total cargo weight impact (${totalWeight} kg).
        *   The 'optimizedRoute' in the JSON should reflect the metrics for this single, consolidated trip.

    3.  **Emissions Breakdown (in grams)**:
        *   For the **Standard Scenario**: Calculate the total CO2 footprint by summing total transportation (from all ${numParcels} trips), total packaging (${numParcels} * 75g), and total energy (${numParcels} * 120g). Provide a breakdown.
        *   For the **Optimized Scenario**:
            *   Transportation emissions are from the single consolidated trip.
            *   Assume recommendations lead to a 20% reduction in total packaging emissions and a 15% reduction in total energy emissions for all parcels.
            *   Calculate the new packaging and energy emissions (e.g., optimized packaging = (${numParcels} * 75g) * 0.8) and provide the breakdown.

    4.  **Savings**:
        *   Calculate the total CO2 saved (Standard Scenario Total CO2 - Optimized Scenario Total CO2).
        *   Calculate the total time saved in minutes (Standard Scenario Total Time - Optimized Scenario Total Time).

    5.  **Actionable Recommendations**:
        *   Provide 2-3 concrete recommendations relevant to consolidating shipments and reducing waste for multiple parcels.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text.trim();
    const result: AnalysisResultData = JSON.parse(jsonString);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get route analysis from Gemini API.");
  }
}