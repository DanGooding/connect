output "public_ip" {
  description = "public ip of service"
  value       = aws_eip.public_ip
}
