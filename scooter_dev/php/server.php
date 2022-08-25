<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$name = control($_POST['userName']);
$tel = control($_POST['userTel']);
// echo $name;
// echo $tel;
$mail = new PHPMailer(true);
$mail->setLanguage('ru', 'phpmailer/language/');
$mail->CharSet = 'UTF-8';
$mail->isHTML(true);
$mail->isSMTP();
$mail->Host = 'smtp.mail.ru';
$mail->SMTPAuth = true;
$mail->Username = 'setoff_hr@bk.ru';
$mail->Password = 'Coffee2020';
$mail->SMTPSecure = 'ssl';
$mail->Port = 465;
$mail->setFrom('setoff_hr@bk.ru', 'Scooter'); //от Кого
$mail->addAddress('rv920490@gmail.com', 'Admin'); //Кому
$mail->Subject = "Заявка с сайта";
$mail->Body    = "Телефон: ";

function control($item)
{
	$item = htmlspecialchars($item);
	$item = urldecode($item);
	$item = trim($item);
	return $item;
}

if (!$mail->send()) {
	$message = "Ошибка передачи";
} else {
	$message = "Данные отправлены";
}
$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);