// src/components/ProfileSync.js
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

// what the hell does this file do?
// - if user is authenticated:
//      - sends POST request to /users/profile with user details
//      - does nothing with the response
// 
// Seems like a hack to sync users from Auth0 db to Postgres db. Find alternative?
// Auth0 doesn't allow much sync functionality on the free tier...
// 
// issues:
// - network request and db query on every component load
// - odd architecture
// 
// solution:
// - running post-login/register hook in Auth0 (implemented)

function ProfileSync() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    console.log('ProfileSync mounted');
    
    if (isAuthenticated && user) {
      console.log('User is authenticated:', user?.sub);
      
      const saveUserProfile = async () => {
        try {
          const token = await getAccessTokenSilently();
          // console.log('Token retrieved:', !!token);
          // console.log('Complete user object being sent to backend:', user);
          
          const _response = await axios.post(`${apiUrl}/users/profile`, {
            sub: user.sub,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            // Make sure we include the custom claim specifically
            "https://tcupboard.org/username": user[`https://tcupboard.org/username`],
            preferred_username: user.preferred_username
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error in saveUserProfile:', error);
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
          }
          console.error('Request URL:', error.config?.url);
        }
      };

      saveUserProfile();
    }
  }, [isAuthenticated, user, getAccessTokenSilently, apiUrl]);

  return null;
}

export default ProfileSync;