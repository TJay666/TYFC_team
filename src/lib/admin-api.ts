import { USER_ROLES, User } from "@/lib/types";

// Using the likely correct API base URL for your environment
const API_BASE_URL = 'http://localhost:8000'; 

// Fetches users from the Django backend API.
export const fetchUsers = async (): Promise<User[]> => {
  try {
    // Corrected API endpoint path
    const response = await fetch(`${API_BASE_URL}/api/users/users/`, {
      headers: {
        'Content-Type': 'application/json',
        // TODO: Include authentication headers if needed (e.g., 'Authorization': 'Bearer YOUR_TOKEN')
        // Use the accessToken from the auth context
      },
    });
    if (!response.ok) {
      // Handle non-2xx responses
      const errorData = await response.json();
      console.error('Failed to fetch users:', errorData || response.statusText);
      throw new Error(`Failed to fetch users: ${errorData.detail || response.statusText}`);
    }
    const data = await response.json();
    // Map backend data to frontend User type if necessary
    // Assuming backend returns objects with id, username, role, email
    return data.map((item: any) => ({
      id: item.id.toString(), // Ensure id is string if your frontend expects string
      name: item.username, // Assuming username is used as name
      role: item.role as USER_ROLES, // Cast backend role string to USER_ROLES enum
      email: item.email, // Include email if available
      // Add other fields as needed
    }));
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw error; // Re-throw the error for frontend to handle
  }
};

// Updates a user's role on the Django backend API.
export const updateUserRole = async (userId: string, newRole: USER_ROLES): Promise<void> => {
  try {
    // Corrected API endpoint path
    const response = await fetch(`${API_BASE_URL}/api/users/users/${userId}/role/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Include authentication headers if needed (e.g., 'Authorization': 'Bearer YOUR_TOKEN')
        // Use the accessToken from the auth context
      },      
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
      // Handle non-2xx responses
      const errorData = await response.json();
      console.error(`Failed to update user ${userId} role:`, errorData || response.statusText);
      throw new Error(`Failed to update user role: ${errorData.detail || response.statusText}`);
    }

    // Assuming the backend returns the updated user data, you could process it here if needed
    // const updatedUserData = await response.json();
    console.log(`User ${userId} role updated successfully to ${newRole}`);

  } catch (error: any) {
    console.error(`Error updating user ${userId} role:`, error);
    throw error; // Re-throw the error for frontend to handle
  }
};
