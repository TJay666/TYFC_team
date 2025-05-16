# backend/users/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'password')
        read_only_fields = ('id', 'role') # Role should not be set by the user during registration

    def create(self, validated_data):
        # Remove password from validated_data as create_user handles hashing
        password = validated_data.pop('password')
        # Create user using create_user to handle password hashing and setting defaults
        user = User.objects.create_user(**validated_data)
        user.set_password(password) # Ensure password is set correctly with hashing
        user.save()
        return user

    # Optional: Add update method if you need to handle user updates via this serializer
    # def update(self, instance, validated_data):
    #     instance.username = validated_data.get('username', instance.username)
    #     instance.email = validated_data.get('email', instance.email)
    #     # Handle password update separately if needed
    #     if 'password' in validated_data:
    #         instance.set_password(validated_data['password'])
    #     instance.save()
    #     return instance
