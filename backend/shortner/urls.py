"""
URL configuration for shortner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from shortner import views

urlpatterns = [
	# Global level paths
    path('admin/', admin.site.urls),
    path('health/', views.health_check, name='health'),
	path("r/<str:short_url>/", views.redirect_short_url, name='redirect_url'),
	
    # Application level paths
    path("api/short/", include("short.urls")),
    path("api/paste/", include("pastes.urls")),
	
]


# Unknown paths Custom handlers
handler404 = views.custom_404
handler500 = views.custom_500
