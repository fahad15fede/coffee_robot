# Database Fix Instructions

## Problem
The database has unique constraints on the `phone` and `email` columns in the `customers` table, which prevents multiple customers from using the same phone number or email. This is problematic for scenarios like:
- Children under guardianship using parent's phone
- Family members sharing contact information
- Multiple orders from the same household

## Solution
Remove the unique constraints to allow duplicate phone numbers and emails.

## How to Fix

### Option 1: Run the Python Script (Recommended)

1. Navigate to the backend directory:
```bash
cd "OOP barista coffee"
```

2. Run the fix script:
```bash
python fix_database_constraints.py
```

3. You should see:
```
🔧 Fixing database constraints...
✅ Removed unique constraint from phone column
✅ Removed unique constraint from email column

✨ Database fixed! Customers can now have duplicate phone/email.
```

### Option 2: Manual SQL (Alternative)

If the script doesn't work, run these SQL commands directly in PostgreSQL:

1. Open PostgreSQL command line or pgAdmin

2. Connect to the `coffee_robot` database

3. Run these commands:
```sql
-- Remove unique constraint from phone
ALTER TABLE customers 
DROP CONSTRAINT IF EXISTS customers_phone_key;

-- Remove unique constraint from email
ALTER TABLE customers 
DROP CONSTRAINT IF EXISTS customers_email_key;

-- Verify constraints are removed
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'customers';
```

## Verification

After running the fix, test by:

1. Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

2. Try registering with the same phone number twice
3. Both registrations should succeed
4. Check the database - you should see multiple customers with the same phone

## What Changed

### Before:
```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(50),
    phone VARCHAR(20) UNIQUE,  -- ❌ This prevented duplicates
    email VARCHAR(100) UNIQUE  -- ❌ This prevented duplicates
);
```

### After:
```sql
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    customer_name VARCHAR(50),
    phone VARCHAR(20),         -- ✅ Now allows duplicates
    email VARCHAR(100)         -- ✅ Now allows duplicates
);
```

## Payment Error Fix

The payment error (`400 Bad Request` on `/orders/6/pay`) might be due to:

1. **Order already paid**: Check if order status is already "paid"
2. **Order not found**: Verify the order exists
3. **Database constraint**: The `mark_order_paid` function might have validation

To debug, check the backend logs for the specific error message after "400 Bad Request".

## Common Issues

### Issue: "Connection refused"
**Solution**: Make sure PostgreSQL is running

### Issue: "Authentication failed"
**Solution**: Check database credentials in `customer_db.py`:
- host: localhost
- database: coffee_robot
- user: postgres
- password: fahad15fede

### Issue: "Database does not exist"
**Solution**: Create the database first:
```sql
CREATE DATABASE coffee_robot;
```

## Testing After Fix

1. Register a customer with phone: `0328-0334013`
2. Register another customer with the same phone
3. Both should succeed
4. Check database:
```sql
SELECT * FROM customers WHERE phone = '0328-0334013';
```
You should see multiple rows.

## Rollback (If Needed)

If you need to add the constraints back:
```sql
-- Add unique constraint back to phone
ALTER TABLE customers 
ADD CONSTRAINT customers_phone_key UNIQUE (phone);

-- Add unique constraint back to email
ALTER TABLE customers 
ADD CONSTRAINT customers_email_key UNIQUE (email);
```

## Notes

- This change is permanent and affects the database structure
- Existing data is not modified, only the constraints
- The application will now allow duplicate phone/email registrations
- Each registration still gets a unique `customer_id`
