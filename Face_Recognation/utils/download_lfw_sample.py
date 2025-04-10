# utils/download_lfw_sample.py
import os
from sklearn.datasets import fetch_lfw_people
import cv2

def download_lfw_subset(save_path='Face_Recognition/dataset', people_limit=3, images_per_person=3):
    os.makedirs(save_path, exist_ok=True)
    dataset = fetch_lfw_people(min_faces_per_person=images_per_person, resize=1.0, color=True)

    for i in range(len(dataset.images)):
        person = dataset.target_names[dataset.target[i]]
        person_dir = os.path.join(save_path, person.replace(' ', '_'))
        os.makedirs(person_dir, exist_ok=True)
        img = dataset.images[i]
        img_bgr = cv2.cvtColor(img.astype('uint8'), cv2.COLOR_RGB2BGR)
        filename = os.path.join(person_dir, f'{i}.jpg')
        cv2.imwrite(filename, img_bgr)

    print(f"Saved a subset of LFW to: {save_path}")
