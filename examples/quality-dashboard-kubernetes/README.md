# Example: Runnin on Kubernetes

Run the sample deployment code as follow:

```bash
kubectl create ns quality-dashboard
kubectl kustomize kustomize/base | kubectl -n quality-dashboard apply -f -
```