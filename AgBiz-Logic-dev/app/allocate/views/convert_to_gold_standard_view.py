from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from registration.models import ScheduleF



class ConvertToGoldStandardView(APIView):
    """ API endpoint to convert a ScheduleF object to a Gold Standard dictionary.
    """

    def post(self, request):
        """ A POST request to this endpoint accepts the id of a ScheduleF object and will convert it into a dictionary
            in the Gold Standard for allocation, then return it.
        """

        if "schedulef" in request.data and type(request.data["schedulef"]) is int:
            try:
                schedulef = ScheduleF.objects.filter(id=request.data["schedulef"])[0]
                gold_standard_data = schedulef.convert_to_gold_standard()

                response = Response(gold_standard_data, status=200)

            except IndexError:
                response = Response({"No ScheduleF object with given id"}, status=404)

        else:
            response = Response({'Missing ScheduleF id'}, status=400)

        return response
