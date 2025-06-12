# **Gateway Routing Pattern Demo**

Esta demo demuestra la implementación del **Gateway Routing Pattern** usando Kubernetes, NGINX Ingress Controller, y microservicios desarrollados en Node.js.

## **Resumen de la Arquitectura**

- **Single Endpoint**: Todas las consultas se realizan a través de `http://localhost/api/*`
- **Multiple Services**: Product, User, Order, Notification services
- **Multiple Instances**: User service (3 replicas), Order service (2 replicas) para load balancing
- **Version Routing**: Product service soporta v1 y v2 mediante headers HTTP

## **Estructura del Proyecto**

```
gateway-routing-demo/
├── services/
│   ├── product-service/     # Manejo de productos con versionado
│   ├── user-service/        # Gestión de usuarios (3 replicas)
│   ├── order-service/       # Procesamiento de órdenes (2 replicas)
│   └── notification-service/ # Servicio de notificaciones
├── k8s/
│   ├── product-service.yaml
│   ├── user-service.yaml
│   ├── order-service.yaml
│   ├── notification-service.yaml
│   └── gateway-ingress.yaml  # Configuración del Gateway
├── docker-compose.yml
├── test-commands.txt
└── README.md
```

## **Prerrequisitos**

1. **Docker Desktop** con Kubernetes habilitado
2. **NGINX Ingress Controller** instalado:
   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
   ```

## **Setup y Despliegue**

### **1. Clonar la estructura del proyecto**
Crear todos los archivos según la estructura mostrada arriba.

### **2. Construir las imágenes Docker**
```bash
docker build -t product-service ./services/product-service
docker build -t user-service ./services/user-service
docker build -t order-service ./services/order-service
docker build -t notification-service ./services/notification-service
```

### **3. Desplegar a Kubernetes**
```bash
kubectl apply -f k8s/
```

### **4. Verificar el despliegue**
```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

## **Pruebas del Gateway Routing Pattern**

### **1. Single Endpoint - Ruteo Básico**
Todos los servicios son accesibles desde un único endpoint:
```bash
curl http://localhost/api/products
curl http://localhost/api/users
curl http://localhost/api/orders
curl http://localhost/api/notifications
```

### **2. Multiple Instances - Load Balancing**
Probar la distribución de carga entre múltiples instancias:
```bash
# User Service (3 replicas)
for i in {1..5}; do
  echo "Request $i:"
  curl http://localhost/api/users | grep instance
  sleep 1
done

# Order Service (2 replicas)
for i in {1..5}; do
  echo "Order Request $i:"
  curl http://localhost/api/orders | grep instance
  sleep 1
done
```

### **3. Version Routing**
Product Service soporta dos versiones mediante headers:
```bash
# Versión v1 (por defecto)
curl http://localhost/api/products

# Versión v2 (información extendida)
curl http://localhost/api/products -H "x-version: v2"

# Comparar respuestas
curl http://localhost/api/products -H "x-version: v1"
curl http://localhost/api/products -H "x-version: v2"
```

### **4. Alta Disponibilidad - Failover Test**
Demostrar que el sistema continúa funcionando cuando se elimina una instancia:
```bash
# Listar pods del User Service
kubectl get pods -l app=user-service

# Eliminar un pod específico
kubectl delete pod [POD_NAME]

# Probar que el servicio sigue funcionando
for i in {1..3}; do
  echo "Request during failover $i:"
  curl http://localhost/api/users
  sleep 2
done
```

### **5. Escalabilidad Dinámica**
```bash
# Escalar User Service a 5 replicas
kubectl scale deployment user-service --replicas=5
kubectl get pods -l app=user-service

# Probar load balancing con más instancias
for i in {1..5}; do
  curl http://localhost/api/users | grep instance
done

# Volver a la configuración original
kubectl scale deployment user-service --replicas=3
```

## **Factores Demostrados**

### **1. Single Endpoint**
- **Implementación**: NGINX Ingress Controller rutea todas las peticiones desde `http://localhost/api/*`
- **Beneficio**: Los clientes solo necesitan conocer un punto de entrada
- **Demostración**: Todos los servicios responden desde el mismo host y puerto

### **2. Multiple Service Instances**
- **User Service**: 3 réplicas para distribución de carga
- **Order Service**: 2 réplicas para alta disponibilidad
- **Beneficio**: Mejor rendimiento y tolerancia a fallos
- **Demostración**: Load balancing automático entre instancias

### **3. Version Routing**
- **Product Service**: Soporta v1 y v2 basado en header `x-version`
- **Beneficio**: Permite actualizaciones graduales sin interrumpir el servicio
- **Demostración**: Misma URL, diferentes respuestas según versión

## **Comandos de Monitoreo**

```bash
# Estado de los pods
kubectl get pods -o wide

# Logs de servicios
kubectl logs -l app=product-service --tail=10
kubectl logs -l app=user-service --tail=10

# Información de services e ingress
kubectl get svc
kubectl get ingress

# Describe ingress para ver routing rules
kubectl describe ingress api-gateway
```

## **Limpieza del Entorno**

Para eliminar todos los recursos creados:
```bash
kubectl delete -f k8s/
```

Para eliminar también las imágenes Docker:
```bash
docker rmi product-service user-service order-service notification-service
```

## **Troubleshooting**

### **Si los servicios no responden:**
1. Verificar que NGINX Ingress Controller esté ejecutándose:
   ```bash
   kubectl get pods -n ingress-nginx
   ```

2. Comprobar logs del ingress:
   ```bash
   kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
   ```

### **Si el load balancing no funciona:**
1. Verificar que hay múltiples pods ejecutándose:
   ```bash
   kubectl get pods -l app=user-service
   ```

2. Comprobar que el service está distribuyendo la carga:
   ```bash
   kubectl describe service user-service
   ```

## **Servicios Incluidos**

- **Product Service** (Puerto 3000): Catálogo de productos con versionado v1/v2
- **User Service** (Puerto 3000): Gestión de usuarios con 3 instancias para load balancing
- **Order Service** (Puerto 3000): Procesamiento de órdenes con 2 instancias para alta disponibilidad
- **Notification Service** (Puerto 3000): Manejo de notificaciones con instancia única

## **Tecnologías Utilizadas**

- **Node.js + Express**: Microservicios REST API
- **Docker**: Containerización de servicios
- **Kubernetes**: Orquestación y gestión de contenedores
- **NGINX Ingress Controller**: Gateway routing y load balancing
- **Docker Desktop**: Entorno de desarrollo local