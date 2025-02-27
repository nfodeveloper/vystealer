from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import time

def load_cookies(driver, cookies_file):
    with open(cookies_file, 'r') as file:
        cookies = file.readlines()
    for cookie in cookies:
        cookie = cookie.strip()
        if cookie:
            name, value = cookie.split('=', 1)
            driver.add_cookie({'name': name, 'value': value})

def get_verification_code():
    options = Options()
    options.add_argument("--headless")
    service = Service('path/to/chromedriver')
    driver = webdriver.Chrome(service=service, options=options)
    
    driver.get("https://mail.google.com")
    load_cookies(driver, 'cookies.txt')
    driver.refresh()
    
    time.sleep(5)
    
    search_box = driver.find_element(By.NAME, 'q')
    search_box.send_keys("Your discord email verification is")
    search_box.send_keys(Keys.RETURN)
    
    time.sleep(5) 
    
    emails = driver.find_elements(By.CSS_SELECTOR, 'div.Cp div table tbody tr')
    for email in emails:
        if "Your discord email verification is" in email.text:
            email.click()
            time.sleep(2)
            code_element = driver.find_element(By.XPATH, '//text()[contains(., "Your discord email verification is")]/following::text()[1]')
            print(code_element.text.strip())
            break
    
    driver.quit()

if __name__ == "__main__":
    get_verification_code()
