# Database Management Scripts

This directory contains comprehensive scripts for managing the MunLink Zambales database, users, and file uploads.

## Scripts Overview

### 1. `database_manager.py` - Full Interactive Manager
**Purpose**: Complete interactive database management with menu-driven interface.

**Features**:
- Check all users and admin users
- Delete specific users, all admins, or all residents
- Clear all users and uploads
- Preserve municipalities data
- Full database cleanup

**Usage**:
```bash
python scripts/database_manager.py
```

### 2. `quick_db_ops.py` - Command Line Operations
**Purpose**: Quick command-line operations for automation and scripting.

**Features**:
- Check user counts
- List users
- Delete specific users
- Clear all users
- Clear uploads
- Preserve municipalities
- Full cleanup

**Usage**:
```bash
# Check user counts
python scripts/quick_db_ops.py check-users

# List all users
python scripts/quick_db_ops.py list-users

# Delete specific user
python scripts/quick_db_ops.py delete-user 1

# Clear all users
python scripts/quick_db_ops.py clear-users

# Clear uploads directory
python scripts/quick_db_ops.py clear-uploads

# Preserve municipalities data
python scripts/quick_db_ops.py preserve-municipalities

# Full cleanup (users + uploads + municipalities)
python scripts/quick_db_ops.py full-cleanup
```

### 3. `db_manager.ps1` - PowerShell Script (Windows)
**Purpose**: Windows PowerShell wrapper for database operations.

**Usage**:
```powershell
# Interactive menu
.\scripts\db_manager.ps1

# Quick operations
.\scripts\db_manager.ps1 check-users
.\scripts\db_manager.ps1 list-users
.\scripts\db_manager.ps1 delete-user 1
.\scripts\db_manager.ps1 full-cleanup
```

## Operations Guide

### Checking Users
```bash
# Check user counts
python scripts/quick_db_ops.py check-users

# List all users with details
python scripts/quick_db_ops.py list-users
```

### Deleting Users
```bash
# Delete specific user by ID
python scripts/quick_db_ops.py delete-user 1

# Clear all users
python scripts/quick_db_ops.py clear-users
```

### Managing Files
```bash
# Clear all uploads
python scripts/quick_db_ops.py clear-uploads
```

### Preserving Data
```bash
# Preserve municipalities data
python scripts/quick_db_ops.py preserve-municipalities
```

### Full Cleanup
```bash
# Complete cleanup (users + uploads + preserve municipalities)
python scripts/quick_db_ops.py full-cleanup
```

## Safety Features

### Data Preservation
- **Municipalities are always preserved** during cleanup operations
- Municipalities data is loaded from `data/locations/zambales_municipalities.json`
- Database structure remains intact

### Confirmation Prompts
- All destructive operations require confirmation
- Interactive menu shows clear options
- Command-line operations are explicit

### File Management
- Files are properly deleted from uploads directory
- Empty directories are cleaned up
- File paths are validated before deletion

## Database Structure Preserved

The scripts ensure the following data is preserved:
- ✅ **Municipalities table** - All 13 Zambales municipalities
- ✅ **Database schema** - All tables and relationships
- ✅ **Municipalities data** - Loaded from JSON file

## What Gets Deleted

### Users Table
- All user records (admins and residents)
- User profile information
- User verification documents

### Uploads Directory
- All uploaded files
- Empty directories
- File structure (but directories are recreated as needed)

## Examples

### Development Reset
```bash
# Reset database for development
python scripts/quick_db_ops.py full-cleanup
```

### Remove Specific User
```bash
# Delete user with ID 1
python scripts/quick_db_ops.py delete-user 1
```

### Check Current State
```bash
# See what users exist
python scripts/quick_db_ops.py list-users
```

### Clear Uploads Only
```bash
# Remove all uploaded files
python scripts/quick_db_ops.py clear-uploads
```

## Error Handling

- Database connection errors are handled gracefully
- File deletion errors are logged
- Invalid user IDs are caught
- Missing files are handled without crashing

## Requirements

- Python 3.6+
- SQLite3 database
- Access to project root directory
- `data/locations/zambales_municipalities.json` file

## Safety Notes

⚠️ **WARNING**: These scripts perform destructive operations:
- User deletion is permanent
- File deletion is permanent
- Always backup important data before running cleanup operations

✅ **SAFE**: Municipalities data is always preserved and restored from the JSON file.

## Troubleshooting

### Database Not Found
```
Database not found: munlink_zambales.db
```
**Solution**: Run scripts from project root directory.

### Municipalities File Missing
```
Municipalities file not found: data/locations/zambales_municipalities.json
```
**Solution**: Ensure the JSON file exists in the correct location.

### Permission Errors
```
Error deleting file: Permission denied
```
**Solution**: Run with appropriate permissions or close files that might be in use.
