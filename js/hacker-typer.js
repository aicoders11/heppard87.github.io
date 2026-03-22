document.addEventListener('DOMContentLoaded', () => {
    const codeOutput = document.getElementById('code-output');
    const container = document.getElementById('hacker-container');
    const cursor = document.getElementById('input-cursor');

    // This is a snippet of the Linux kernel source code. 
    // It looks complex and is perfect for the "hacker" effect.
    const sourceCode = `
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/fs.h>
#include <linux/device.h>
#include <linux/uaccess.h>

#define DEVICE_NAME "hacker"
#define CLASS_NAME  "hck"

static int majorNumber;
static char message[256] = {0};
static short size_of_message;
static struct class* hackerClass  = NULL;
static struct device* hackerDevice = NULL;

static int     dev_open(struct inode *, struct file *);
static int     dev_release(struct inode *, struct file *);
static ssize_t dev_read(struct file *, char *, size_t, loff_t *);
static ssize_t dev_write(struct file *, const char *, size_t, loff_t *);

static struct file_operations fops =
{
   .open = dev_open,
   .read = dev_read,
   .write = dev_write,
   .release = dev_release,
};

static int __init hacker_init(void){
   printk(KERN_INFO "Hacker: Initializing the Hacker LKM\\n");

   majorNumber = register_chrdev(0, DEVICE_NAME, &fops);
   if (majorNumber<0){
      printk(KERN_ALERT "Hacker failed to register a major number\\n");
      return majorNumber;
   }
   printk(KERN_INFO "Hacker: registered correctly with major number %d\\n", majorNumber);

   hackerClass = class_create(THIS_MODULE, CLASS_NAME);
   if (IS_ERR(hackerClass)){
      unregister_chrdev(majorNumber, DEVICE_NAME);
      printk(KERN_ALERT "Failed to register device class\\n");
      return PTR_ERR(hackerClass);
   }
   printk(KERN_INFO "Hacker: device class registered correctly\\n");

   hackerDevice = device_create(hackerClass, NULL, MKDEV(majorNumber, 0), NULL, DEVICE_NAME);
   if (IS_ERR(hackerDevice)){
      class_destroy(hackerClass);
      unregister_chrdev(majorNumber, DEVICE_NAME);
      printk(KERN_ALERT "Failed to create the device\\n");
      return PTR_ERR(hackerDevice);
   }
   printk(KERN_INFO "Hacker: device class created correctly\\n");
   return 0;
}
    `;

    let currentIndex = 0;

    function typeCode() {
        // Type a few characters at a time for a more realistic effect
        const charsToType = Math.floor(Math.random() * 5) + 3;
        let snippet = sourceCode.substring(currentIndex, currentIndex + charsToType);
        
        // Don't let it go past the end
        if (currentIndex + charsToType > sourceCode.length) {
            snippet = sourceCode.substring(currentIndex);
            currentIndex = sourceCode.length; // End of code
        } else {
            currentIndex += charsToType;
        }

        codeOutput.textContent += snippet;

        // Auto-scroll to the bottom to keep the cursor visible
        container.scrollTop = container.scrollHeight;

        // Reset if we reach the end of the code
        if (currentIndex >= sourceCode.length) {
            currentIndex = 0;
            // Add a small delay then clear for effect
            setTimeout(() => {
                codeOutput.textContent += "\\n\\n--- RECOMPILING KERNEL ---\\n";
                 container.scrollTop = container.scrollHeight;
            }, 500);
            setTimeout(() => {
                codeOutput.textContent = "";
            }, 2000);
        }
    }

    // Listen for any keypress on the page
    document.addEventListener('keydown', (e) => {
        // Prevent default browser actions for keys like space, tab, etc.
        e.preventDefault();
        typeCode();
    });

    // Also allow typing on mobile/touch devices
    document.addEventListener('touchstart', (e) => {
        e.preventDefault();
        typeCode();
    });

    // Initial message
    codeOutput.textContent = "ACCESS GRANTED. PRESS ANY KEY TO BEGIN KERNEL DECRYPTION...";
});
