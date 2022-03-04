from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from AgBiz_Logic.settings import get_environment


class DashboardHomeView(TemplateView):
    """ Main view where Angular takes over client-side routing.
    """

    template_name = "dashboard/index.html"
    environment = get_environment()

    def getEnvironment():
        return environment


    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        """ Overriding this method allows method decorators to check login status.
        """

        return super(DashboardHomeView, self).dispatch(*args, **kwargs)
