from django.views.generic.base import TemplateView
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from AgBiz_Logic.settings import get_environment


class InventoryHomeView(TemplateView):
    """ The homepage of the Budget module.
    """

    template_name = "inventory/index.html"
    environment = get_environment()

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        """ Overriding this method allows method decorators to check login status.
        """

        return super(InventoryHomeView, self).dispatch(*args, **kwargs)
