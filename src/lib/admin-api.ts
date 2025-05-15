import { USER_ROLES, User } from "@/lib/types";

const API_BASE_URL = 'http://localhost:8000'; // Assuming your Django backend runs on this URL

// Fetches users from the Django backend API.
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/`, {
      headers: {
        // Include authentication headers if needed (e.g., 'Authorization': 'Bearer YOUR_TOKEN')
        // Replace 'YOUR_TOKEN' with the actual authentication token
        // 'Authorization': 'Bearer YOUR_TOKEN'
      },
    });
    if (!response.ok) {
      // Handle non-2xx responses
      console.error('Failed to fetch users:', response.statusText);
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    const data = await response.json();
    // Map backend data to frontend User type if necessary
    // Assuming backend returns objects with id, username, role, email
    return data.map((item: any) => ({
      id: item.id.toString(), // Ensure id is string if your frontend expects string
      name: item.username, // Assuming username is used as name
      role: item.role as USER_ROLES, // Cast backend role string to USER_ROLES enum
      // Add other fields as needed (e.g., email)
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Re-throw the error for frontend to handle
  }
};

// Updates a user's role on the Django backend API.
export const updateUserRole = async (userId: string, newRole: USER_ROLES): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Include authentication headers if needed (e.g., 'Authorization': 'Bearer YOUR_TOKEN')
        // Replace 'YOUR_TOKEN' with the actual authentication token
        // 'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
      // Handle non-2xx responses
      console.error(`Failed to update user ${userId} role:`, response.statusText);
      throw new Error(`Failed to update user role: ${response.statusText}`);
    }

    // Assuming the backend returns the updated user data, you could process it here if needed
    // const updatedUserData = await response.json();
    console.log(`User ${userId} role updated successfully to ${newRole}`);

  } catch (error) {
    console.error(`Error updating user ${userId} role:`, error);
    throw error; // Re-throw the error for frontend to handle
  }
};
