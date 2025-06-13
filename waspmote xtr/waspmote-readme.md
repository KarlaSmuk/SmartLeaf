Za konfiguraciju Libelium Smart Agriculture Xtreme je potrebno instalirati Waspmote IDE.

U Waspmote IDE otvorite agrixtrm.pde.

Prije uploadanja pod Tools namjestite odgovarajući port na kojem se spojen uređaj.

Kada ste to napravili možete uploadati kod.

Za prikaz ispisa otvorite serial monitor (Tools/Serial Monitor ili Ctrl+Shift+M) te postavite baud 115200.


Konfiguracija komunikacije:

Potrebno je promjeniti varijable RX_ADDRESS i PANID na adresu i pan id mrežnog prilaza te u setup{} xbee868LP.setChannel(15); na odgovarajući kanal.
