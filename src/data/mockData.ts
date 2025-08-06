import { Shipment } from '../types';

export const mockShipments: Shipment[] = [
  {
    trackingId: 'SWIFT1234567',
    recipient: 'John Smith',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    status: 'in_transit',
    service: 'Express Delivery',
    shipDate: '2025-01-10T08:00:00.000Z',
    estimatedDelivery: '2025-01-13T17:00:00.000Z',
    updates: [
      {
        status: 'in_transit',
        description: 'Package in transit to delivery facility',
        location: 'Denver, CO',
        timestamp: '2025-01-12T14:20:00.000Z',
        notes: 'On schedule for delivery tomorrow'
      },
      {
        status: 'in_transit',
        description: 'Package departed from sorting center',
        location: 'Chicago, IL',
        timestamp: '2025-01-11T19:45:00.000Z',
      },
      {
        status: 'processing',
        description: 'Package arrived at sorting center',
        location: 'Chicago, IL',
        timestamp: '2025-01-11T12:30:00.000Z',
      },
      {
        status: 'processing',
        description: 'Package processed at origin facility',
        location: 'New York, NY',
        timestamp: '2025-01-10T14:15:00.000Z',
      },
      {
        status: 'pending',
        description: 'Shipping label created',
        location: 'New York, NY',
        timestamp: '2025-01-10T08:00:00.000Z',
      }
    ]
  },
  {
    trackingId: 'SWIFT9876543',
    recipient: 'Alice Johnson',
    origin: 'Seattle, WA',
    destination: 'Miami, FL',
    status: 'delivered',
    service: 'Standard Shipping',
    shipDate: '2025-01-05T10:30:00.000Z',
    estimatedDelivery: '2025-01-12T17:00:00.000Z',
    updates: [
      {
        status: 'delivered',
        description: 'Package delivered',
        location: 'Miami, FL',
        timestamp: '2025-01-12T14:20:00.000Z',
        notes: 'Signed by: A. Johnson'
      },
      {
        status: 'in_transit',
        description: 'Out for delivery',
        location: 'Miami, FL',
        timestamp: '2025-01-12T09:30:00.000Z',
      },
      {
        status: 'in_transit',
        description: 'Package arrived at destination facility',
        location: 'Miami, FL',
        timestamp: '2025-01-11T18:45:00.000Z',
      },
      {
        status: 'in_transit',
        description: 'Package in transit',
        location: 'Atlanta, GA',
        timestamp: '2025-01-09T11:20:00.000Z',
      },
      {
        status: 'processing',
        description: 'Package departed from origin facility',
        location: 'Seattle, WA',
        timestamp: '2025-01-06T15:30:00.000Z',
      },
      {
        status: 'pending',
        description: 'Shipping label created',
        location: 'Seattle, WA',
        timestamp: '2025-01-05T10:30:00.000Z',
      }
    ]
  },
  {
    trackingId: 'SWIFT4567890',
    recipient: 'Robert Chen',
    origin: 'San Francisco, CA',
    destination: 'Boston, MA',
    status: 'processing',
    service: 'Priority Overnight',
    shipDate: '2025-01-12T16:45:00.000Z',
    estimatedDelivery: '2025-01-13T12:00:00.000Z',
    updates: [
      {
        status: 'processing',
        description: 'Package processed at origin facility',
        location: 'San Francisco, CA',
        timestamp: '2025-01-12T18:20:00.000Z',
      },
      {
        status: 'pending',
        description: 'Shipping label created',
        location: 'San Francisco, CA',
        timestamp: '2025-01-12T16:45:00.000Z',
      }
    ]
  },
  {
    trackingId: 'SWIFT7654321',
    recipient: 'Maria Garcia',
    origin: 'Austin, TX',
    destination: 'Chicago, IL',
    status: 'pending',
    service: 'Ground Shipping',
    shipDate: '2025-01-12T14:20:00.000Z',
    estimatedDelivery: '2025-01-18T17:00:00.000Z',
    updates: [
      {
        status: 'pending',
        description: 'Shipping label created',
        location: 'Austin, TX',
        timestamp: '2025-01-12T14:20:00.000Z',
      }
    ]
  }
];