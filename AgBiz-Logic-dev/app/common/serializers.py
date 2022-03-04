from rest_framework import serializers
from django.contrib.auth.models import User



class UserSerializer(serializers.ModelSerializer):
    """ Serializer for User model.
    """

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_superuser",
        )



class SupportMessageSerializer(serializers.Serializer):
    """ Serializer for support messages.
    """

    subject = serializers.CharField(max_length=100)
    message = serializers.CharField(max_length=500)



class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """ Dynamic fields serializer mixin.
    """

    def __init__(self, *args, **kwargs):
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        # If this serializer was called as part of an http request
        if self.context:
            fields = self.context['request'].query_params.get('fields')

            if fields is not None:
                fields = fields.split(',')
                # Drop any fields that are not specified in the `fields` argument
                allowed = set(fields)
                existing = set(self.fields.keys())
                if existing.isdisjoint(allowed) is False:
                    for field_name in existing - allowed:
                        self.fields.pop(field_name)
