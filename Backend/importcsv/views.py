from django.http import HttpResponse
from django.shortcuts import render
##import models

# Create your views here.

def index(request):
    return render(request, 'index.html')


def result(request):
    return render(request, 'result.html')

def upload_file(request):
    if request.method == "POST":
        fileTitle = request.POST["fileTitle"]
        uploadedFile = request.FILES["uploadedFile"]

        # Saving the information in the database
        document = models.Document(
            title = fileTitle,
            uploadedFile = uploadedFile
        )
        document.save()

    documents = models.Document.objects.all()
    
    return render(request, "index.html", context = {
        "files": documents
    })