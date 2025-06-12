# gateway_routing_pattern
A demo of: Route requests to multiple services or multiple service instances using a single endpoint. The pattern is useful when you want to:

# Build all services
docker-compose build

# Deploy to Kubernetes
kubectl apply -f k8s/

# Test the gateway
curl http://localhost/api/products
curl http://localhost/api/users
curl http://localhost/api/orders
curl http://localhost/api/notifications