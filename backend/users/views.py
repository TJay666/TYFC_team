# backend/users/views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
# from .serializers import UserSerializer # You would create this serializer

User = get_user_model()

@api_view(['GET'])
def user_list(request):
    """
    List all users.
    (Requires authentication and permission checks in a real application)
    """
    users = User.objects.all()
    # serializer = UserSerializer(users, many=True) # Use a serializer to format the data
    # return Response(serializer.data)
    
    # Placeholder response without serializer
    users_data = [{'id': user.id, 'username': user.username, 'role': user.role, 'email': user.email} for user in users]
    return Response(users_data)

@api_view(['PATCH'])
def update_user_role(request, user_id):
    """
    Update a user's role.
    (Requires authentication, permission checks, and validation in a real application)
    """
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Basic role update without validation
    new_role = request.data.get('role')
    if new_role in [choice[0] for choice in User.Role.choices]:
        user.role = new_role
        user.save()
        # serializer = UserSerializer(user) # Use serializer for consistent output
        # return Response(serializer.data)
        
        # Placeholder response without serializer
        return Response({'id': user.id, 'username': user.username, 'role': user.role, 'email': user.email})
    else:
        return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)