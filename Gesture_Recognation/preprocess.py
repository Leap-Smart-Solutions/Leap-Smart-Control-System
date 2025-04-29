import numpy as np

def preprocess_imu_data(raw_data, window_size=5):
    """
    Preprocess IMU data by applying smoothing and normalization.

    Parameters:
    - raw_data (np.array): raw IMU signal (shape: N x F)
    - window_size (int): size of the moving average window

    Returns:
    - np.array: preprocessed data
    """
    smoothed = []
    for i in range(raw_data.shape[1]):  # لكل feature على حدة
        signal = raw_data[:, i]
        smooth = np.convolve(signal, np.ones(window_size)/window_size, mode='valid')
        smoothed.append(smooth)

    smoothed = np.stack(smoothed, axis=1)  # N x F بعد التمليس
    normalized = (smoothed - np.mean(smoothed, axis=0)) / np.std(smoothed, axis=0)

    return normalized

