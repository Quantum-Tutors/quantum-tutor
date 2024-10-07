import requests
import time
import threading

def ping_stay_alive():
    while True:
        try:
            response = requests.get("https://quantum-tutor.onrender.com/stay_alive")
            print(f"Response status: {response.status_code}, Response body: {response.text}")
        except Exception as e:
            print(f"Error occurred: {e}")
        time.sleep(180)

if __name__ == "__main__":
    ping_thread = threading.Thread(target=ping_stay_alive)
    ping_thread.start()
