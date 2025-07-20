// app/api/alerts/route.js
import { NextResponse } from 'next/server';
import { generateMockAlerts } from '../../../utils/mockData';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const type = searchParams.get('type');
    const acknowledged = searchParams.get('acknowledged');
    const limit = parseInt(searchParams.get('limit')) || 50;

    // Generate mock alerts
    let alerts = generateMockAlerts();

    // Apply filters
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }

    if (type) {
      alerts = alerts.filter(alert => alert.type === type);
    }

    if (acknowledged !== null) {
      const isAcknowledged = acknowledged === 'true';
      alerts = alerts.filter(alert => alert.acknowledged === isAcknowledged);
    }

    // Apply limit
    alerts = alerts.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: alerts,
      count: alerts.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Alerts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const alertData = await request.json();
    
    // Generate a new alert
    const newAlert = {
      id: `ALERT-${Date.now()}`,
      ...alertData,
      time: new Date().toISOString(),
      acknowledged: false,
      resolvedAt: null
    };

    // In a real application, you would save to database
    console.log('Creating new alert:', newAlert);

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: 'Alert created successfully'
    });

  } catch (error) {
    console.error('Create alert error:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, acknowledged, resolvedAt, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // In a real application, you would update in database
    console.log('Updating alert:', id, { acknowledged, resolvedAt, ...updateData });

    const updatedAlert = {
      id,
      acknowledged: acknowledged !== undefined ? acknowledged : false,
      resolvedAt: resolvedAt || (acknowledged ? new Date().toISOString() : null),
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedAlert,
      message: 'Alert updated successfully'
    });

  } catch (error) {
    console.error('Update alert error:', error);
    return NextResponse.json(
      { error: 'Failed to update alert' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // In a real application, you would delete from database
    console.log('Dismissing alert:', id);

    return NextResponse.json({
      success: true,
      message: 'Alert dismissed successfully'
    });

  } catch (error) {
    console.error('Dismiss alert error:', error);
    return NextResponse.json(
      { error: 'Failed to dismiss alert' },
      { status: 500 }
    );
  }
}