<?php
include 'config.php';

if(!session_id())
    session_start();

$date = !empty($_GET['date'])?$_GET['date']: date('Y-m-d');
$user = !empty($_GET['user'])?$_GET['user']: "";

$sql = "SELECT * FROM data WHERE DATE(`date`) = '$date' AND user='".$user."'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $entries = [];
    $start_time = '';
    $end_time = '';
    $total_time = 0;
    $last_entry = '';
    while ($row = $result->fetch_assoc()) {
        $row['time'] = date('Y-m-d h:i:s A', strtotime($row['time']));
        if($row['type'] == 'in'){
            $start_time = $row['time'];
        } else {
            $end_time = $row['time'];

            $total_time = $total_time + (strtotime($end_time) - strtotime($start_time));
        }
        $entries[] = $row;
        $last_entry = $row['type'];
    }

    if($last_entry == 'in'){
        $total_time = $total_time + (strtotime(date('Y-m-d H:i:s')) - strtotime($start_time));
    }

    $hours = floor($total_time / 3600);
    $minutes = floor(($total_time % 3600) / 60);
    $seconds = $total_time % 60;

    $perday = 28800;
    $remaingtime = $perday - $total_time;

    $currentTimestamp = time();
    $newTimestamp = $currentTimestamp + $remaingtime;
    $newDateTime = date('h:i:s A', $newTimestamp);


    $total_time = sprintf('%02d:%02d:%02d', $hours, $minutes,$seconds);

    echo json_encode(['entries' => $entries, 'time'=> $total_time, 'exit_time'=>$newDateTime]);
} else {
    echo "No entries found for the selected date";
}

$conn->close();
?>
