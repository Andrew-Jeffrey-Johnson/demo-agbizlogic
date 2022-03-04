from django.db import models
from django.contrib.auth.models import User


TILE_TYPES = (
    ("info", "info"),
    ("budgets", "budgets"),
    ("scenarios", "scenarios"),
    ("climate", "climate"),
    ("profit", "profit"),
    ("lease", "lease"),
    ("finance", "finance"),
    ("envirionment", "environment"),
)


class Dashboard(models.Model):
    """ Represents the configuration of a specific dashboard. Has a one-to-many relationship with several Tile's.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE,)


    def __str__(self):
        return u"%s" % (self.user.username)



class Tile(models.Model):
    """ Represents a tile from the dashboard. Has a many-to-one relationship with a Dashboard.

        row - refers to the vertical position of the tile (ascending from the top of the page)
        column - refers to the horizontal position of the tile (ascending from the left side of the page)
    """

    dashboard = models.ForeignKey(Dashboard, related_name="tiles", on_delete=models.CASCADE,)

    tile_type = models.CharField(max_length=50, choices=TILE_TYPES, blank=False)
    row = models.PositiveIntegerField(default=1, blank=False)
    column = models.PositiveIntegerField(default=1, blank=False)


    def __str__(self):
        return u"%s" % (self.tile_type + ", " + self.dashboard.user.username)
