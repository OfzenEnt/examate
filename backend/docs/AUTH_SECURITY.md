# Authentication Security Implementation

## Security Features Implemented

### 1. **Refresh Token Hashing**
- Refresh tokens are hashed using SHA256 before database storage
- Prevents immediate token reuse if database is compromised
- Raw tokens never stored in database

### 2. **Access Token Blacklisting**
- Short-lived access tokens (15 minutes) with unique JTI
- Blacklisted tokens checked on every request
- Automatic cleanup of expired blacklisted tokens

### 3. **Token Rotation**
- New refresh token issued on every refresh
- Old refresh token immediately invalidated
- Prevents token replay attacks

### 4. **Logout Security**
- Single logout: Blacklists current access token + deletes refresh token
- Logout-all: Deletes all user's refresh tokens
- Note: Existing access tokens remain valid until expiry (max 15 minutes)

## Security Limitations & Trade-offs

### JWT Stateless Nature
- Cannot instantly invalidate all access tokens without maintaining state
- Existing access tokens valid until natural expiry (15 minutes max)
- This is standard JWT behavior - keep access token TTL short

### Error Handling in Logout
- Uses `jwt.decode()` (not `jwt.verify()`) to extract JTI for blacklisting
- Safe since only used for invalidation, not authentication
- Continues logout process even if blacklisting fails

## Database Schema

```sql
-- Hashed refresh tokens
CREATE TABLE refresh_tokens (
    user_id INT,
    token VARCHAR(255), -- SHA256 hash
    expires_at DATETIME
);

-- Blacklisted access token JTIs
CREATE TABLE blacklisted_tokens (
    token_jti VARCHAR(255), -- JWT ID
    expires_at DATETIME
);
```

## Best Practices Followed

✅ Short-lived access tokens (15m)  
✅ Long-lived refresh tokens (7d) with rotation  
✅ Refresh tokens hashed before storage  
✅ Access token blacklisting on logout  
✅ Automatic cleanup of expired tokens  
✅ Role-based access control  
✅ Proper error handling and logging  

## Client Implementation Notes

- Store tokens in SecureStore/Keychain (not AsyncStorage)
- Handle 401 responses by attempting token refresh
- Clear both tokens on logout
- Implement automatic token refresh before expiry