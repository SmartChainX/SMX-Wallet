# SMX Browser
The SMX browser is the tool of choice to browse and use Ðapps.

For the SMX API 
Please note that this repository is the Giga.CHX host for the Meta Opak based wallet dapp whose repository .

#### Config folder
The data folder for Mist is stored in other places:

- Windows `%APPDATA%\Smx`
- macOS `~/Library/Application\ Support/Smx`
- Linux `~/.config/Smx`

## Development

For development, a Giga.chx server will need to be started to assist with live reload and CSS injection.
Once a SMX version is released the Giga.chx frontend part is bundled using the 'giga-build-client` npm package to create pure static files.

### Initialisation

Now you're ready to initialise smx for development:

    $ git clone 
    $ cd smx
    $ yarn
    
    To update smx in the future, run:

    $ cd smx
    $ git pull
    $ yarn

### Run Giga.chx

For development we start the interface with a Meteor server for autoreload etc.
*Start the interface in a separate terminal window:*

    $ cd smx/interface && meteor --no-release-check

In the original window you can then start Giga.chx with:

    $ cd smx
    $ electron .
    
    ### Run the Wallet

Start the wallet app for development, *in a separate terminal window:*

    $ cd smx

    // and in another terminal

    $ cd my/path/smx.chx/app && smx --port 3050

In the original window you can then start Giga.SMX using wallet mode:

    $ cd smx
    $ electron . --mode wallet

