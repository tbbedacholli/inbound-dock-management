// app/api/loads/route.js
import { NextResponse } from 'next/server';
import { generateMockLoads, generateMockMetrics } from '../../../utils/mockData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const zone = searchParams.get('zone');

    // Generate mock loads data
    const loads = generateMockLoads();
    
    // Filter loads based on query parameters
    let filteredLoads = loads;
    
    if (date) {
      filteredLoads = { [date]: loads[date] || [] };
    }
    
    if (status || zone) {
      Object.keys(filteredLoads).forEach(dateKey => {
        filteredLoads[dateKey] = filteredLoads[dateKey].filter(load => {
          if (status && load.status !== status) return false;
          if (zone && load.tempZone !== zone) return false;
          return true;
        });
      });
    }

    return NextResponse.json({
      success: true,
      data: filteredLoads,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Loads API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loads data' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const loadData = await request.json();
    
    // In a real application, you would save to database
    console.log('Creating new load:', loadData);
    
    // Generate a new load ID
    const newLoad = {
      id: `LD-${Date.now()}`,
      ...loadData,
      createdAt: new Date().toISOString(),
      status: 'scheduled'
    };

    return NextResponse.json({
      success: true,
      data: newLoad,
      message: 'Load created successfully'
    });

  } catch (error) {
    console.error('Create load error:', error);
    return NextResponse.json(
      { error: 'Failed to create load' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Load ID is required' },
        { status: 400 }
      );
    }

    // In a real application, you would update in database
    console.log('Updating load:', id, updateData);

    const updatedLoad = {
      id,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedLoad,
      message: 'Load updated successfully'
    });

  } catch (error) {
    console.error('Update load error:', error);
    return NextResponse.json(
      { error: 'Failed to update load' },
      { status: 500 }
    );
  }
}