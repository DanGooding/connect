output "alb_hostname" {
  description = "hostname of entry point load balancer"
  value       = module.alb.dns_name
}
