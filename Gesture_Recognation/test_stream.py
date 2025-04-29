# test_stream.py
from imu.stream_imu import stream_imu_data

for line in stream_imu_data(port='COM3'):  # Update the port for your system
    print(line)
