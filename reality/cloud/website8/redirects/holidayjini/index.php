<?php
$parameters = filter_var($_SERVER['QUERY_STRING'], FILTER_SANITIZE_EMAIL);
if (strlen($parameters) > 0) {
  $parameters = "?" . $parameters;
}
header("Location: https://apps.8thwall.com/8w/holidayjini/" . $parameters);
die();
?>
