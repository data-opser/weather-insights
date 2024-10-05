provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "weather_insights" {
  name     = "weather_insights"
  location = "Germany West Central"
}

resource "random_password" "password" {
  length           = 16
}


resource "azurerm_postgresql_flexible_server" "example" {
  name                          = "weather"
  resource_group_name           = azurerm_resource_group.weather_insights.name
  location                      = azurerm_resource_group.weather_insights.location
  version                       = "16"
  public_network_access_enabled = true
  administrator_login           = "psqladmin"
  administrator_password        = random_password.password.result
  zone                          = "1"
  storage_mb   = 32768
  storage_tier = "P4"

  sku_name   = "B_Standard_B1ms"
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "weather" {
  name             = "weather-fw"
  server_id        = azurerm_postgresql_flexible_server.example.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

output "password" {
  value     = random_password.password.result
  sensitive = true
}