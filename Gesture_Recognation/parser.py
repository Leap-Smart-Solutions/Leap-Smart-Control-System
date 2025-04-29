def parse_imu_line(line):
    try:
        return [float(val) for val in line.split(',')]
    except ValueError:
        return None