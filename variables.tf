variable "project_name" {
  description = "tag applied to all resources"
  type        = string
  default     = "connect"
}

variable "domain_certificate_arn" {
  description = "certificate of public domain for the site"
  type        = string
  default     = "arn:aws:acm:eu-west-2:196481062593:certificate/4ece37fb-0fe4-49d9-8929-65354870ca46"
}
