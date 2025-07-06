/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.seed = async function (knex) {

    await knex('posts').del();

    await knex("posts").insert([
        {
            user_id: 1,
            title: `Como aprendi a programar desmontando jogos em Flash`, formatted_title: `como-aprendi-a-programar-desmontando-jogos-em-flash`,
            description: `Comecei a programar aos 11 por curiosidade com modificações em um jogo Flash. Em vez de usar, foquei em entender como eram feitas. Aprendi engenharia reversa e a alterar o ByteCode do jogo...`,
            content: `<p>Comecei a programar por volta dos 11 anos. E foi uma grande mudança, já que não possuía muita afinidade com computadores - nenhuma, basicamente. Eu mal sabia instalar um programa.</p><br>

<p>Tudo começou em um jogo de navegador, que rodava no finado Flash Player, que havia acabado de conhecer e comecei a passar horas jogando.</p><br>

<p>Um certo dia estava jogando e vi um jogador fazendo algo que até então não seria possível no jogo: ele estava se movendo muito rápido, voando e aparecendo instantaneamente em lugares diferentes do mapa. Achei aquilo muito legal e fui atrás de entender do que se tratava.</p><br>

<p>Não foi muito difícil encontrar o que aquele jogador estava usando. Haviam sites públicos, com uma comunidade considerável, que postavam regularmente trainers que modificavam o jogo e davam vantagens para o jogador.</p><br>

<p>Tratei logo de baixar e quando finalmente injetei a trapaça no jogo, pra minha surpresa, não havia a mesma graça que eu acreditei que teria. O jogo perdeu totalmente o significado e junto com isso se perdia também o sentido de continuar usando.</p><br>

<p>Após isso, meu interesse deixou de ser usar e passou a ser entender como era feito e isso não foi tão fácil de encontrar, como se fosse um segredo.</p><br> 

<p>Depois de refletir muito, pensei que como os trainers modificavam o jogo, se eu tivesse o arquivo original do jogo e o arquivo alterado, eu poderia comparar eles e verificar o que havia sido alterado.</p><br>

<p>Algumas coisas não eram difíceis de descobrir, como por exemplo, que o jogo é feito em flash e que haviam softwares que faziam a descompilação do arquivo do jogo. Porém, eu ainda precisaria encontrar uma forma de obter o arquivo do jogo.</p><br> 

<p>Depois de procurar bastante, encontrei um executável (bem duvidoso) chamado SWF Memory Dumper (SMD). A única coisa que eu sabia era que havia um processo chamado 'FlashPlayer.exe' e que eu precisava selecionar ele e clicar em alguns botões e o arquivo do jogo era baixado no meu computador.</p><br>

<p>Como eu era um completo ignorante no assunto, não sabia exatamente o que eu estava fazendo, apenas que precisva fazer.</p><br>

<p>Mais tarde eu entendi que o jogo era feito em Flash, com uma linguagem de programação chamada ActionScript 3 (AS3).</p><br> 

<p>O processo de compilação gerava um arquivo de extensão .SWF (Shockwave Flash) que servia como um container para todos os assets do projeto como imagens, sons, os metadados e também o bytecode (ABC).</p><br> 

<p>A compilação transformava o código AS3 em um código intermediário chamado Action Script Bytecode (ABC) e esse ABC era interpretado pela máquina virtual (AVM2) chamada FlashPlayer.</p><br>

<p>Cada Bytecode é um valor binário, que possui um nome correspondente para facilitar a compreensão e que vai ser interpretado pela máquina virtual.</p><br> 

<p>Outra linguagem que usa bytecodes, máquina virtual e é interpretada é o Java.</p><br>

<p><b>Exemplo de ABC:</b></p><br>

<pre><code class="language-typescript">
trait method QName(PackageNamespace(""),"Initialize")
   dispid 0
   method
      name null
      param QName(PackageNamespace("Box2D.Collision"),"b2BroadPhase")
      param QName(PackageNamespace("Box2D.Collision"),"b2PairCallback")
      returns QName(PackageNamespace(""),"void")
      
      body
         maxstack 2
         localcount 3
         initscopedepth 4
         maxscopedepth 5
         
         code
            ; d0
            getlocal0
            ; 30
            pushscope
            ; d0
            getlocal0
            ; d1
            getlocal1
            ; 68 e3 04
            initproperty QName(PackageNamespace(""),"m_broadPhase")
            ; d0
            getlocal0
            ; d2
            getlocal2
            ; 68 ba 0a
            initproperty QName(PackageNamespace(""),"m_callback")
            ; 47
            returnvoid
         end ; code
      end ; body
   end ; method
end ; trait
</code></pre><br>

<p>Na memória, os bytes formariam a sequência:</p><br>

<pre><code class="language-typescript">
d0 30 d0 d1 68 e3 04 d0 d2 68 ba 0a 47 
</code></pre><br>

<p>O que o SMD fazia era procurar nas região da memória virtual da AVM2 os bytes do ABC e dos componentes da SWF, que haviam sido armazenados durante a execução e então gerava um novo arquivo contendo esses bytes.</p><br>

<p>Exemplo de uma região da memória da máquina virtual em que o ABC eram armazenados durante a execução:</p><br>

<img src="/images/x64dbg.png" alt="Imagem mostrando uma lista de regiões da memória virtual usada pela AVM2"><br><br> 

<p>Durante o processo eu tive algumas sortes, como por exemplo, não ter que lidar e nem saber da existência do processo de compressão e descompressão do arquivo SWF. Isso não foi um empecilho, já que quando o arquivo SWF é carregado pela máquina virtual ela faz a descompressão. Então quando o SMD baixava os bytes, eles já estavam sem compressão.</p><br> 

<p>Mais pra frente aprendi que os 3 primeiros bytes do arquivo SWF indicavam se o SWF estava comprimido ou não e os possíveis valores eram: FWS para sem compressão (0x46 0x57 0x53), CWS para compressão a partir do byte 8 (0x43 0x57 0x53) e ZWS para compressão a partir do byte 12 (0x5A 0x57 0x53).</p><br>

<p>Os tutorias que ensinavam a usar os trainer seguiam o mesmo padrão: primeiro se abria o jogo e o deixava na tela de login sem apertar em nenhuma tecla e sem clicar em nada. Posteriormente se abria o trainer, marcava as checkboxs e então se podia entrar no jogo. Sempre segui isso sem entender exatamente o porque, mas depois também aprendi que o AVM2 usava algo chamado Just-In-Time Compiler (JIT Compiler). Isso signfica que o ABC que é gerado durante a compilação, na hora em que era executado pela AVM2 era convertido em código de máquina propriamente dito. </p><br> 

<p>Porém, esse processo só era feito de acordo com o que fosse executado. Por exemplo: imagine que há uma função que ouve eventos de teclado. Ela só vai ser lida e convertida pra código de máquina se durante a execução do jogo uma tecla for pressionada. A partir do momento que a função foi executada e convertida pra código de máquina, o ABC daquela função não vai ser mais lido e consequentemente não adiantaria mais editar ele.</p><br>

<p>Por isso primeiro se abria o jogo e o deixava na tela de login, pois a maioria das funções não seriam usadas e conseguentemente o ABC não seria convertido em código de máquina, permitindo alterar o ABC. Portanto se alterava o ABC, entrava no jogo e quando a função fosse executada, o ABC alterado seria convertido em código de máquina e a alteração seria aplicada no jogo.</p><br> 

<p>Então nesse ponto eu já sabia baixar o arquivo .SWF do jogo e eu já sabia que eu poderia usar descompiladores como o Sothink SWF Decompiler ou o JPEXS Free Flash Decompiler pra visualizar o código 'original'.</p><br> 

<p>Os decompiladores mostram um código ActionScript 3 correspondente ao ABC (bytecode) que está dentro do .SWF. Porém, esse AS3 que é mostrado não é exatamente o mesmo que foi programado pelo desenvolvedor, já que a compilação utiliza otimizações que fazem com que a estrutura do completa do código original seja perdida.</p><br> 

<p>Exemplo de Action Script Bytecode e seu correspondente em ActionScript 3:</p><br>

<p><b>ABC:</b></p><br>

<pre><code class="language-typescript">
trait method QName(PrivateNamespace(null,"19"),"Find")
   dispid 0
   method
      name null
      param QName(PackageNamespace(""),"uint")
      param QName(PackageNamespace(""),"uint")
      returns QName(PackageNamespace("Box2D.Collision"),"b2Pair")
      
      body
         maxstack 4
         localcount 5
         initscopedepth 4
         maxscopedepth 5
         
         code
            getlocal0
            pushscope
            pushbyte 0
            convert_u
            setlocal 4
            getlocal1
            getlocal2
            ifngt ofs0018
            getlocal1
            convert_u
            setlocal 4
            getlocal2
            convert_u
            setlocal1
            getlocal 4
            convert_u
            setlocal2
   ofs0018:
            findpropstrict QName(PackageNamespace(""),"Hash")
            getlocal1
            getlocal2
            callproperty QName(PackageNamespace(""),"Hash"), 2
            getlex QName(PackageNamespace("Box2D.Collision"),"b2Pair")
            getproperty QName(PackageNamespace(""),"b2_tableMask")
            bitand
            convert_u
            setlocal3
            getlocal0
            getlocal1
            getlocal2
            getlocal3
            callproperty QName(PrivateNamespace(null,"19"),"FindHash"), 3
            returnvalue
         end ; code
      end ; body
   end ; method
end ; trait
</code></pre><br>

<p><b>ActionScript 3:</b></p><br>

<pre><code class="language-typescript">
private function Find(param1:uint, param2:uint) : b2Pair
{
    var _loc4_:uint = 0;
    if(param1 > param2)
    {
    _loc4_ = param1;
    param1 = param2;
    param2 = _loc4_;
    }
    var _loc3_:uint = uint(Hash(param1,param2) & b2Pair.b2_tableMask);
    return this.FindHash(param1,param2,_loc3_);
}
</code></pre><br>

<p>A partir daí, bastava eu usar o SMD no jogo pra baixar o arquivo original, depois injetar o trainer no jogo e baixar o arquivo do jogo alterado e então comparar os dois arquivos para entender o que havia sido feito.</p><br> 

<p>Esse processo seria simples, se não fosse pelo fato do jogo ter milhares de linha de código.</p><br> 

<p>Depois de procurar muito e quase desistir várias vezes, acabei encontrando trechos que estavam diferentes, porém eu ainda não sabia nada sobre programação e não conseguia dizer o que e nem porque havia sido feito, apesar de estar olhando.</p><br>

<p>Foi partir de então que comecei a de fato aprender a programar. Comecei a ver vídeos, tutoriais em sites, a visitar fóruns e etc.</p><br> 

<p>Queria poder dizer que meu aprendizado foi rápido e que rapidamente comecei a programar e a desenvolver softwares adoidado, mas não foi o que aconteceu.</p><br> 

<p>Naquela época eu não sabia estudar e o pouco conhecimento que eu tinha me fez me acomodar e era o suficiente para que eu não me aprofundasse. Na verdade eu nem saberia como me aprofundar, não sabia nem o que era uma documentação.</p><br> 

<p>No fim eu não tinha o objetivo de criar algo de fato e sim apenas modificar algo que já existia.</p><br>

<p>Aprendi o suficiente da linguagem e do bytecode para conseguir fazer minhas próprias alterações sem quebrar o jogo.</p><br> 

<p>A princípio, eu apenas alterava trechos bytes que já existiam, eu não conseguia adicionar mais bytes porque o jogo travava.</p><br> 

<p>Mais pra frente eu descobri que há uma região no header da SWF que determina o tamanho em bytes do arquivo, e se estiver diferente do tamanho real, a SWF quebra ou não carrega. Isso acontece pois quando a AVM2 usa o tamanho especificado para definir o tamanho da memória a ser alocada para armazenar os bytes da SWF.</p><br>

<p>Então eu procurava algum trecho de código, visualizava o bytecode, fazia minhas alterações, usava algum programa que busca sequências de bytes (Array of Bytes) na memória usada pelo processo (nesse caso a AVM2) e então substituía pela minha sequência de bytes alterada. Por exemplo:</p><br>

<p>Digamos que queremos fazer que quando eu aperte uma tecla, meu jogador suba. Ele vai apenas subir verticalmente, não vai pular, não vai ter nenhum tipo de verificação, apenas subir. </p><br>

<p></p><br>Primeiro, procuramos a função que lida com os eventos de teclado e então procuramos algum trecho pra alterar. No trecho a seguir é verificado se a tecla shift é pressionada e então ele rotaciona um objeto se houver um objeto selecionado e não estiver criando nada:</p><br>

<pre><code class="language-typescript">
private function keyDownListener(param1:KeyboardEvent) : void
{
   var _loc2_:int = int(param1.keyCode);
   // ...
   else if(_loc2_ == 88 || _loc2_ == 16)
   {
      if(Boolean(this.CurrentObject) && !this.SummoninginProgress)
      {
         this.CurrentObject.rotation += 15;
      }
   }
}
</code></pre><br>

<p>Por conta das otimizações feitas na hora da compilação, alguns nomes de variáveis são perdidos.</p><br>

<p>Nesse caso, _loc2_ armazenará o valor da tecla que foi pressionada e vai ser usada para verificar se a tecla pressionada corresponde a um determinado valor.</p><br> 

<p>Se o valor de _loc2_ for 88, código da tecla 'X', ou 16, código da tecla 'shift', o código de dentro vai ser executado.</p><br> 

<p>O que queremos alterar realmente é a parte de dentro, que é executada quando é identificado que a tecla shift foi pressionada:</p><br>

<pre><code class="language-typescript">
if(Boolean(this.CurrentObject) && !this.SummoninginProgress)
{
    this.CurrentObject.rotation += 15;
}
</code></pre><br>

<p>O bytecode seria:</p><br>

<pre><code class="language-typescript">
    ; d0
    getlocal0
    ; 66 a1 02
    getproperty QName(PackageNamespace(""),"CurrentObject")
    ; 76
    convert_b
    ; 2a
    dup
    ; 12 06 00 00
    iffalse ofs0455
    ; 29
    pop
    ; d0
    getlocal0
    ; 66 c5 02
    getproperty QName(PackageNamespace(""),"SummoninginProgress")
    ; 96
    not
    ; 12 11 00 00
ofs0455:
    iffalse ofs046a
    ; d0
    getlocal0
    ; 66 a1 02
    getproperty QName(PackageNamespace(""),"CurrentObject")
    ; d0
    getlocal0
    ; 66 a1 02
    getproperty QName(PackageNamespace(""),"CurrentObject")
    ; 66 b8 17
    getproperty QName(PackageNamespace(""),"rotation")
    ; 24 0f
    pushbyte 15
    ; a0
    add
    ; 61 b8 17
    setproperty QName(PackageNamespace(""),"rotation")
</code></pre><br>

<p>Note que parece que no ABC as linhas seguem uma ordem invertida (na maior parte das vezes) se comparado ao código AS3 que foi escrito. Isso se dá porque o AVM2 implementa um sistema de STACK semelhante (semelhante com muitas aspas) ao que ocorre em Assembly, onde o último elemento adicionado na pilha é removido/acessado.</p>

<p>O Array of Bytes desse ABC seria:</p><br>

<pre><code class="language-typescript">
d0 66 a1 02 76 2a 12 06 00 00 29 d0 66 c5 02 96 12 11 00 00 d0 66 a1 02 d0 66 a1 02 66 b8 17 24 0f a0 61 b8 17 
</code></pre><br>

<p>Eu sei que o jogo usa uma biblioteca de física 2d chamada Box2D, e seguindo a documentação, pra mover um objeto, seria preciso acessar a propriedade y, que pertence ao objeto m_linearVelocity (responsável pela velocidade dos objetos no mundo físico), que por sua vez pertence ao objeto Physique, que pertence ao objeto Player:</p><br>

<pre><code class="language-typescript">
this.Player.Physique.m_linearVelocity.y = -5
</code></pre><br>

<p>Porém, pra conseguir usar isso de fato, eu preciso do bytecode de cada objeto. Buscando um por um, pra nós mesmos montarmos, ficaria algo assim:</p><br>

<pre><code class="language-typescript">
this = d0 // getlocal0
Player = 66 9b 01 // getproperty QName(PackageNamespace(""),"Player")
Physique = 66 f7 04 // getproperty QName(PackageNamespace(""),"Physique")
m_linearVelocity = 66 b1 07 // getproperty QName(PackageNamespace(""),"m_linearVelocity")
-5 = 24 fb // pushbyte -5
y = 61 e2 05 // setproperty QName(PackageNamespace(""),"y")
</code></pre><br>

<p>E o Array of Bytes:</p><br>

<pre><code class="language-typescript">
d1 66 9b 01 66 f7 04 66 b1 07 24 fb 61 e2 05
</code></pre><br>

<p>Note que enquanto estamos apenas acessando uma propriedade, o bytecode começa com o byte 66. Quando estamos atribuindo um valor, o bytecode começa com 61 e o valor que vai ser atribuído fica logo acima (24 fb).</p><br> 

<p>Se quisermos atribuir um valor a m_linearVelocity, por exemplo, poderíamos alterar o 66 por 61 e passar o valor acima dele:</p><br>

<pre><code class="language-typescript">
this.Player.Physique.m_linearVelocity = null;
</code></pre><br>

<p>fica assim:</p><br>

<pre><code class="language-typescript">
this = d0 // getlocal0
Player = 66 9b 01 // getproperty QName(PackageNamespace(""),"Player")
Physique = 66 f7 04 // getproperty QName(PackageNamespace(""),"Physique")
null = 20 // pushnull
m_linearVelocity = 61 b1 07 // getproperty QName(PackageNamespace(""),"m_linearVelocity")
</code></pre><br>

<p>Voltando, então agora temos os Arrays of Bytes que serão alterados e os que colocaremos no lugar:</p><br>

<pre><code class="language-typescript">
d0 66 a1 02 76 2a 12 06 00 00 29 d0 66 c5 02 96 12 11 00 00 d0 66 a1 02 d0 66 a1 02 66 b8 17 24 0f a0 61 b8 17 
>
d1 66 9b 01 66 f7 04 66 b1 07 24 fb 61 e2 05
</code></pre><br>

<p>Claramente eles são de tamanhos diferentes, e como mencionei anteriormente, no header do arquivo diz quantos bytes ele possui e se houver divergência, o jogo irá parar de funcionar.</p><br> 

<p>Podemos contornar isso colocando um bytecode NOP, que possui o valor 02 e que não realiza nenhuma operação quando é interpretado, mas que pode ser usado para cobrir espaços vazíos.</p><br>

<p>Os Arrays of Bytes então ficariam assim:</p><br>

<pre><code class="language-typescript">
d0 66 a1 02 76 2a 12 06 00 00 29 d0 66 c5 02 96 12 11 00 00 d0 66 a1 02 d0 66 a1 02 66 b8 17 24 0f a0 61 b8 17
>
d1 66 9b 01 66 f7 04 66 b1 07 24 fb 61 e2 05 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 02 
</code></pre><br>

<p>Agora, usaremos algum software que faça manipulações na memória usada por um processo para modificar os bytes que estão sendo usados pela AVM2. Procuramos pelo primeiro Array of Byte e então substituímos pelo Array of Bytes que montamos:</p><br>

<img src="/images/ce-image.png" alt="Imagem mostrando a alteração do Array of Byte original pelo alterado no software CheatEngie."><br><br> 

<p>Quando apertarmos shift dentro do jogo, ao invés de executar o código que realizava a verificação se havia um objeto selecionado e não estava criando nada e que executava a rotação do objeto selecionado, agora vai executar o código que faz com que o jogador suba verticalmente (também conhecido como voar).</p><br> 

<p>Se baixarmos o arquivo do jogo da memória após termos alterado, veríamos algo como:</p><br>

<pre><code class="language-typescript">
private function keyDownListener(param1:KeyboardEvent) : void
{
   var _loc2_:int = int(param1.keyCode);
   // ...
   else if(_loc2_ == 88 || _loc2_ == 16)
   {
      this.Player.Physique.m_linearVelocit.y = -5;
   }
}
</code></pre><br>

<p>Fiquei bons anos limitado pela minha falta de visão, preso no pouco conhecimento que eu tinha e na minha ignorância de achar que o que eu sabia era o suficiente.</p><br> 

<p>Com o tempo o FlashPlayer foi descontinuado oficialmente e esse meu conhecimento não podia mais ser aplicado diretamente.</p><br> 

<p>Parei de programar por alguns anos, comecei a estudar e a me interessar por outros assuntos e em um dado momento eu percebi que havia de fato aprendido a estudar e a gostar de estudar. Então voltei para a programação e continuo até hoje.</p><br>

`}
    ])
}