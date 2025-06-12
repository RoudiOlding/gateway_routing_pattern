# Gateway Routing Pattern Demo
Esta demo demuestra la aplicación de **Gateway Routing Pattern** usando Kubernetes, NGINX Ingress, y microservicios de Node.js.

## Resumen de la Arquitectura

- **Single Endpoint**: Todas las consultas se realizan a través de `http://localhost/api/*`
- **Multiple Services**: Product, User, Order, Notification services
- **Multiple Instances**: User service (3 replicas), Order service (2 replicas)
- **Version Routing**: Product service v1 y v2

## Setup

1. **Replicar la estructura del proyecto** and copy all files
2. **Construir y desplegar**:
   ```bash
   # Construir imágenes
   docker build -t product-service ./services/product-service
   docker build -t user-service ./services/user-service
   docker build -t order-service ./services/order-service
   docker build -t notification-service ./services/notification-service
   
   # Desplegar a Kubernetes
   kubectl apply -f k8s/
   ```

3. **Test a las rutas**:
   ```bash
   # Basic routing
   curl http://localhost/api/products
   curl http://localhost/api/users
   
   # Version routing
   curl http://localhost/api/products -H "x-api-version: v2"
   
   # Load balancing test
   for i in {1..5}; do curl http://localhost/api/users | grep instance; done
   ```

## Factores demostrados en la Demo

### 1. Single Endpoint
- Todos los servicios son accedidos desde `http://localhost/api/*`
- NGINX Ingress soporta ruteo basado en la path establecido.

### 2. Multiple Instances
- User Service: 3 replicas (load balanced)
- Order Service: 2 replicas (alta disponibilidad)

### 3. Version Routing
- Product Service v1: Versión por defecto
- Product Service v2: Versión mejorada vía header `x-api-version: v2`

### 4. Tetteo de alta disponibilidad
```bash
# Eliminar un pod y comprobar tolerancia a fallos.
kubectl delete pod [user-service-pod-name]
curl http://localhost/api/users  # Sigue funcionando
```

## Servicios

- **Product Service** (Port 3001): Maneja el catálogo de productos en base a las versiones v1/v2
- **User Service** (Port 3002): User management con 3 instancias
- **Order Service** (Port 3003): Order processing con 2 instancias  
- **Notification Service** (Port 3004): Manejo de notificaciones

## Archivos Clave

- `services/*/server.js`: Implementación de los servicios
- `k8s/*.yaml`: Despliegue de Kubernetes y sus servicios
- `k8s/gateway-ingress.yaml`: NGINX para la configuración del ruteo
- `test-commands.txt`: Los comandos de testing