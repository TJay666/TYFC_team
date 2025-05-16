# backend/users/views.py
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView # Import APIView for class-based views
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()

# Existing function-based views (you might want to convert these to class-based views later)
@api_view(['GET'])
def user_list(request):
    """
    List all users.
    (Requires authentication and permission checks in a real application)
    """
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

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

    # Basic role update with validation using choices
    new_role = request.data.get('role')
    if new_role in [choice[0] for choice in User.Role.choices]:
        user.role = new_role
        user.save()
        serializer = UserSerializer(user) # Use serializer for consistent output
        return Response(serializer.data)
    else:
        return Response({'error': 'Invalid role'}, status=status.HTTP_400_BAD_REQUEST)

# New class-based view for user registration
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save() # Save method in serializer handles user creation and password hashing
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
