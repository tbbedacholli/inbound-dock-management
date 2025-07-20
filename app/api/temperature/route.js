// app/api/temperature/route.js
import { NextResponse } from 'next/server';
import { generateMockTemperatureData } from '../../../utils/mockData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const zone = searchParams.get('zone');
    const hours = parseInt(searchParams.get('hours')) || 24;

    // Generate mock temperature data
    const temperatureData = generateMockTemperatureData();
    
    // Filter by zone if specified
    let filteredData = temperatureData;
    if (zone) {
      filteredData = temperatureData.filter(data => data.zone === zone);
    }

    // Limit history based on hours parameter
    filteredData = filteredData.map(data => ({
      ...data,
      history: data.history.slice(-hours)
    }));

    return NextResponse.json({
      success: true,
      data: filteredData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Temperature API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch temperature data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { zone, temperature, timestamp = new Date().toISOString() } = await request.json();
    
    if (!zone || temperature === undefined) {
      return NextResponse.json(
        { error: 'Zone and temperature are required' },
        { status: 400 }
      );
    }

    // In a real application, you would save to database
    console.log('Recording temperature:', { zone, temperature, timestamp });

    const temperatureRecord = {
      id: `TEMP-${Date.now()}`,
      zone,
      temperature,
      timestamp,
      recordedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: temperatureRecord,
      message: 'Temperature recorded successfully'
    });

  } catch (error) {
    console.error('Record temperature error:', error);
    return NextResponse.json(
      { error: 'Failed to record temperature' },
      { status: 500 }
    );
  }
}