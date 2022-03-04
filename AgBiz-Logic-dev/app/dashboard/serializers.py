from rest_framework import serializers
from dashboard.models import Dashboard, Tile


class TileSerializer(serializers.ModelSerializer):
    """ Serializer for the Tile model.
    """

    class Meta:
        model = Tile
        fields = (
            "id",
            "tile_type",
            "row",
            "column",
        )



class DashboardSerializer(serializers.ModelSerializer):
    """ Serializer for the Dashboard model.
    """

    tiles = TileSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Dashboard
        fields = (
            "id",
            "tiles",
        )
