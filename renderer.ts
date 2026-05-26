export {};

declare const Dos: any;

declare global {
  interface Window {
    dosPlayer: any;
    electronAPI: {
      readWin98Image: () => Uint8Array;
    };
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("dos") as HTMLCanvasElement;

  Dos(canvas, {
    wdosboxUrl: "./dist/vendor/jsdos/wdosbox.js",
    wasmUrl: "./dist/vendor/jsdos/wdosbox.wasm",
    pathPrefix: "./dist/vendor/jsdos/",
    backend: "dosboxX", // Add this line to force dosboxX // doesnt do anything
    noNetworking: false, // Must be false to enable
    ipx: [{
      type: "udp", 
      address: "127.0.0.1:5437" // Define the connection method
    }],
  ipxBackend: "udp", // Select which backend from the array to use
  room: "my-game-lobby-123" // The session room
  }).ready(async (fs: any, main: any) => {
    console.log("js-dos ready " + main);
    try {

     // 2. Define the configuration to force DOS 7 behavior
    // The 'ver=7.10' line is how you spoof/set the reported DOS version
    const myConf = `
[dos]
ver=7.10
keyboardlayout=auto

[dosbox]
language                                        =
beep duration                                   = 0
title                                           = Windows 98 SE
logo text                                       =
logo                                            =
fastbioslogo                                    = false
disable graphical splash                        = false
startbanner                                     = true
bannercolortheme                                = default
configuration tool theme                        =
dpi aware                                       = auto
quit warning                                    = auto
allow quit after warning                        = true
working directory option                        = default
working directory default                       =
show advanced options                           = false
resolve config path                             = true
hostkey                                         = mapper
mapper send key                                 = ctrlaltdel
ime                                             = auto
synchronize time                                = false
keyboard hook                                   = false
weitek                                          = false
bochs debug port e9                             = false
machine                                         = svga_s3
captures                                        = capture
autosave                                        =
saveslot                                        = 1
savefile                                        =
video debug at startup                          = false
saveremark                                      = true
forceloadstate                                  = false
compresssaveparts                               = true
show recorded filename                          = false
skip encoding unchanged frames                  = false
capture chroma format                           = auto
capture format                                  = default
shell environment size                          = 0
shell permanent                                 = false
private area size                               = 32768
a20                                             = mask
turn off a20 gate on boot                       = true
cbus bus clock                                  = std10
isa bus clock                                   = std8.3
pci bus clock                                   = std33.3
call binary on reset                            =
unhandled irq handler                           =
call binary on boot                             =
ibm rom basic                                   =
rom bios allocation max                         = 0
rom bios minimum size                           = 0
irq delay ns                                    = -1
iodelay                                         = -1
iodelay16                                       = -1
iodelay32                                       = -1
acpi                                            = off
acpi rsd ptr location                           = auto
acpi sci irq                                    = -1
acpi iobase                                     = 0
acpi reserved size                              = 0
memory file                                     =
memsize                                         = 256
memsizekb                                       = 0
dos mem limit                                   = 0
isa memory hole at 512kb                        = auto
isa memory hole at 15mb                         = auto
reboot delay                                    = -1
memalias                                        = 0
nocachedir                                      = false
freesizecap                                     = cap
convertdrivefat                                 = true
convert fat free space                          = 250
convert fat timeout                             = 4
leading colon write protect image               = true
locking disk image mount                        = true
unmask keyboard on int 16 read                  = true
int16 keyboard polling undocumented cf behavior = false
allow port 92 reset                             = true
enable port 92                                  = true
enable 1st dma controller                       = true
enable 2nd dma controller                       = true
allow dma address decrement                     = true
enable 128k capable 16-bit dma                  = auto
enable dma extra page registers                 = true
dma page registers write-only                   = false
cascade interrupt never in service              = false
cascade interrupt ignore in service             = auto
enable slave pic                                = true
enable pc nmi mask                              = true
allow more than 640kb base memory               = false
enable pci bus                                  = true

[cpu]
core=normal
cputype=auto
cycles=auto

[log]
# does nadda 

[ipx]
ipx = false

[ne2000]
ne2000  = false # helps nothing 

[autoexec]
imgmount c win98.img -t hdd
boot -l c
`;

    // 3. Write this file to the virtual filesystem
    fs.createFile("dosbox-jsdos.conf", myConf);
      
      const buf = window.electronAPI.readWin98Image();

      fs.createFile("win98.img", buf);

      console.log("win98.img loaded");

      main(["-conf", "dosbox-jsdos.conf"]);
    } catch (err) {
      console.error("Image load failed", err);
    }
  }).setBackend("dosboxX");
});
