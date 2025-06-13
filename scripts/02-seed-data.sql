-- Seed data for testing

-- Insert customers
INSERT INTO customers (id, user_id, name, phone, email, address, notes, created_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'John Smith', '(555) 123-4567', 'john.smith@example.com', '123 Main St, Anytown, CA 12345', 'Prefers evening appointments. Has multiple vehicles that need regular maintenance.', '2023-01-15T00:00:00Z'),
  ('22222222-2222-2222-2222-222222222222', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'Sarah Johnson', '(555) 234-5678', 'sarah.j@example.com', '456 Oak Ave, Anytown, CA 12345', 'Prefers morning appointments.', '2023-02-20T00:00:00Z'),
  ('33333333-3333-3333-3333-333333333333', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'Mike Williams', '(555) 345-6789', 'mike.w@example.com', '789 Pine St, Anytown, CA 12345', 'Has multiple vehicles.', '2023-03-10T00:00:00Z'),
  ('44444444-4444-4444-4444-444444444444', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'Emily Davis', '(555) 456-7890', 'emily.d@example.com', '101 Elm St, Anytown, CA 12345', 'New customer.', '2023-04-05T00:00:00Z'),
  ('55555555-5555-5555-5555-555555555555', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'Robert Brown', '(555) 567-8901', 'robert.b@example.com', '202 Maple Ave, Anytown, CA 12345', 'Referred by John Smith.', '2023-05-15T00:00:00Z');

-- Insert vehicles
INSERT INTO vehicles (id, customer_id, year, make, model, vin, license_plate, color, notes)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '2018', 'Honda', 'Civic', '1HGCM82633A123456', 'ABC123', 'Blue', 'Regular oil changes every 5,000 miles.'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '2020', 'Toyota', 'Corolla', '2T1BURHE5KC123456', 'DEF456', 'Silver', 'New tires installed in January 2023.'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', '2020', 'Toyota', 'Camry', '4T1BF1FK5CU123456', 'XYZ789', 'Black', 'Needs brake inspection.'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', '2019', 'Ford', 'F-150', '1FTEW1EP5JFA12345', 'DEF456', 'Red', 'Regular maintenance.'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', '2021', 'Chevrolet', 'Silverado', '3GCUYDED5MG123456', 'GHI789', 'White', 'New vehicle.'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '33333333-3333-3333-3333-333333333333', '2017', 'Jeep', 'Wrangler', '1C4HJWDG5HL123456', 'JKL012', 'Green', 'Off-road vehicle.'),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '44444444-4444-4444-4444-444444444444', '2021', 'Chevrolet', 'Malibu', '1G1ZD5ST1JF123456', 'GHI789', 'Gray', 'Regular maintenance.'),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '55555555-5555-5555-5555-555555555555', '2017', 'Nissan', 'Altima', '1N4AL3AP7FC123456', 'JKL012', 'Black', 'Needs AC service.');

-- Insert appointments
INSERT INTO appointments (id, user_id, vehicle_id, customer_id, service, description, date, time, duration, address, status, notes)
VALUES 
  ('11111111-aaaa-1111-aaaa-111111111111', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Oil Change', 'Regular oil change with synthetic oil', '2023-06-20', '10:00:00', 60, '123 Main St, Anytown, CA 12345', 'scheduled', 'Customer requested synthetic oil.'),
  ('22222222-bbbb-2222-bbbb-222222222222', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Brake Inspection', 'Check brake pads and rotors', '2023-06-21', '14:00:00', 90, '456 Oak Ave, Anytown, CA 12345', 'scheduled', 'Customer reported squeaking noise when braking.'),
  ('33333333-cccc-3333-cccc-333333333333', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Battery Replacement', 'Replace old battery with new one', '2023-06-22', '09:00:00', 45, '789 Pine St, Anytown, CA 12345', 'scheduled', 'Battery is 4 years old and showing signs of failure.'),
  ('44444444-dddd-4444-dddd-444444444444', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '44444444-4444-4444-4444-444444444444', 'Tire Rotation', 'Rotate tires and check pressure', '2023-06-23', '11:00:00', 30, '101 Elm St, Anytown, CA 12345', 'scheduled', 'Regular maintenance.'),
  ('55555555-eeee-5555-eeee-555555555555', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '55555555-5555-5555-5555-555555555555', 'AC Service', 'Check and recharge AC system', '2023-06-24', '13:00:00', 120, '202 Maple Ave, Anytown, CA 12345', 'scheduled', 'AC not cooling properly.');

-- Insert jobs
INSERT INTO jobs (id, user_id, appointment_id, customer_id, vehicle_id, service, description, status, notes, technician)
VALUES 
  ('aaaaaaaa-1111-aaaa-1111-aaaaaaaaaaaa', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', '11111111-aaaa-1111-aaaa-111111111111', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Oil Change', 'Regular oil change with synthetic oil', 'estimate', 'Customer requested synthetic oil.', 'Mike Johnson'),
  ('bbbbbbbb-2222-bbbb-2222-bbbbbbbbbbbb', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', '22222222-bbbb-2222-bbbb-222222222222', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Brake Inspection', 'Check brake pads and rotors', 'in_progress', 'Customer reported squeaking noise when braking.', 'Mike Johnson'),
  ('cccccccc-3333-cccc-3333-cccccccccccc', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', NULL, '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Transmission Fluid Change', 'Change transmission fluid and filter', 'completed', 'Regular maintenance.', 'Mike Johnson'),
  ('dddddddd-4444-dddd-4444-dddddddddddd', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', NULL, '44444444-4444-4444-4444-444444444444', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'Spark Plug Replacement', 'Replace all spark plugs', 'completed', 'Regular maintenance.', 'Mike Johnson'),
  ('eeeeeeee-5555-eeee-5555-eeeeeeeeeeee', 'user_2NNuWQCQJYXFvVHwi8Nq5P2XNxZ', NULL, '55555555-5555-5555-5555-555555555555', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Wheel Alignment', 'Align all wheels', 'completed', 'Customer reported pulling to the right.', 'Mike Johnson');

-- Insert estimates
INSERT INTO estimates (id, job_id, line_items, subtotal, tax, total, approved, approved_at)
VALUES 
  ('11111111-aaaa-aaaa-aaaa-111111111111', 'aaaaaaaa-1111-aaaa-1111-aaaaaaaaaaaa', 
   '[
      {"id": "1", "description": "Synthetic Oil (5W-30)", "quantity": 5, "unitPrice": 12.00, "total": 60.00, "type": "Parts"},
      {"id": "2", "description": "Oil Filter", "quantity": 1, "unitPrice": 8.00, "total": 8.00, "type": "Parts"},
      {"id": "3", "description": "Labor - Oil Change", "quantity": 0.5, "unitPrice": 80.00, "total": 40.00, "type": "Labor"}
    ]', 
   108.00, 10.80, 118.80, FALSE, NULL),
  ('22222222-bbbb-bbbb-bbbb-222222222222', 'bbbbbbbb-2222-bbbb-2222-bbbbbbbbbbbb', 
   '[
      {"id": "1", "description": "Brake Inspection", "quantity": 1, "unitPrice": 80.00, "total": 80.00, "type": "Labor"},
      {"id": "2", "description": "Brake Pads (Front)", "quantity": 1, "unitPrice": 60.00, "total": 60.00, "type": "Parts"},
      {"id": "3", "description": "Labor - Brake Pad Replacement", "quantity": 1.5, "unitPrice": 80.00, "total": 120.00, "type": "Labor"}
    ]', 
   260.00, 26.00, 286.00, TRUE, '2023-06-15T10:00:00Z'),
  ('33333333-cccc-cccc-cccc-333333333333', 'cccccccc-3333-cccc-3333-cccccccccccc', 
   '[
      {"id": "1", "description": "Transmission Fluid", "quantity": 10, "unitPrice": 8.00, "total": 80.00, "type": "Parts"},
      {"id": "2", "description": "Transmission Filter", "quantity": 1, "unitPrice": 25.00, "total": 25.00, "type": "Parts"},
      {"id": "3", "description": "Labor - Transmission Service", "quantity": 2, "unitPrice": 80.00, "total": 160.00, "type": "Labor"}
    ]', 
   265.00, 26.50, 291.50, TRUE, '2023-05-20T14:00:00Z'),
  ('44444444-dddd-dddd-dddd-444444444444', 'dddddddd-4444-dddd-4444-dddddddddddd', 
   '[
      {"id": "1", "description": "Spark Plugs", "quantity": 4, "unitPrice": 12.00, "total": 48.00, "type": "Parts"},
      {"id": "2", "description": "Labor - Spark Plug Replacement", "quantity": 1, "unitPrice": 80.00, "total": 80.00, "type": "Labor"}
    ]', 
   128.00, 12.80, 140.80, TRUE, '2023-05-10T09:00:00Z'),
  ('55555555-eeee-eeee-eeee-555555555555', 'eeeeeeee-5555-eeee-5555-eeeeeeeeeeee', 
   '[
      {"id": "1", "description": "Wheel Alignment", "quantity": 1, "unitPrice": 120.00, "total": 120.00, "type": "Labor"}
    ]', 
   120.00, 12.00, 132.00, TRUE, '2023-05-05T11:00:00Z');

-- Insert invoices
INSERT INTO invoices (id, job_id, line_items, subtotal, tax, total, payment_status, payment_method, paid_at)
VALUES 
  ('33333333-cccc-cccc-cccc-333333333333', 'cccccccc-3333-cccc-3333-cccccccccccc', 
   '[
      {"id": "1", "description": "Transmission Fluid", "quantity": 10, "unitPrice": 8.00, "total": 80.00, "type": "Parts"},
      {"id": "2", "description": "Transmission Filter", "quantity": 1, "unitPrice": 25.00, "total": 25.00, "type": "Parts"},
      {"id": "3", "description": "Labor - Transmission Service", "quantity": 2, "unitPrice": 80.00, "total": 160.00, "type": "Labor"}
    ]', 
   265.00, 26.50, 291.50, 'paid', 'Credit Card', '2023-05-20T15:30:00Z'),
  ('44444444-dddd-dddd-dddd-444444444444', 'dddddddd-4444-dddd-4444-dddddddddddd', 
   '[
      {"id": "1", "description": "Spark Plugs", "quantity": 4, "unitPrice": 12.00, "total": 48.00, "type": "Parts"},
      {"id": "2", "description": "Labor - Spark Plug Replacement", "quantity": 1, "unitPrice": 80.00, "total": 80.00, "type": "Labor"}
    ]', 
   128.00, 12.80, 140.80, 'paid', 'Cash', '2023-05-10T10:15:00Z'),
  ('55555555-eeee-eeee-eeee-555555555555', 'eeeeeeee-5555-eeee-5555-eeeeeeeeeeee', 
   '[
      {"id": "1", "description": "Wheel Alignment", "quantity": 1, "unitPrice": 120.00, "total": 120.00, "type": "Labor"}
    ]', 
   120.00, 12.00, 132.00, 'paid', 'Credit Card', '2023-05-05T12:30:00Z');
