from django.views.generic import TemplateView
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from AgBiz_Logic.settings import get_environment



class ClimateHomeView(TemplateView):
    """ Main view where Angular takes over client-side routing.
    """

    template_name = "climate/index.html"
    environment = get_environment()


    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        """ Overriding this method allows method decorators to check login status.
        """

        return super(ClimateHomeView, self).dispatch(*args, **kwargs)
