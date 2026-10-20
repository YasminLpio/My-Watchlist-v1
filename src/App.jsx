import { useState, useEffect } from 'react'

//Lista inicial de filmes
const filmesIniciais = [
  {
    id: 1,
    titulo: 'Edward Scissorhands',
    diretor: 'Tim Burton',
    ano: 1990,
    genero: 'Fantasia',
    foto: 'edward-scissorhands.jpg',
    favorito: false,
    assistido: false
  },
  {
    id: 2,
    titulo: 'Pan’s Labyrinth',
    diretor: 'Guillermo del Toro',
    ano: 2006,
    genero: 'Fantasia',
    foto: 'pans-labyrinth.jpg',
    favorito: false,
    assistido: false
  },
  {
    id: 3,
    titulo: 'The Curse of the Black Pearl',
    diretor: 'Gore Verbinski',
    ano: 2003,
    genero: 'Aventura',
    foto: 'the-curse-of-the-black-pearl.jpg',
    favorito: false,
    assistido: false
  },
  {
    id: 4,
    titulo: 'Kill Bill: Vol. 1',
    diretor: 'Quentin Tarantino',
    ano: 2003,
    genero: 'Ação',
    foto: 'kill-bill.jpg',
    favorito: false,
    assistido: false
  },
  {
    id: 5,
    titulo: 'Ferris Bueller’s Day Off',
    diretor: 'John Hughes',
    ano: 1986,
    genero: 'Comédia',
    foto: 'ferris-bueller.jpg',
    favorito: false,
    assistido: false
  },
  {
    id: 6,
    titulo: 'Dead Poets Society',
    diretor: 'Peter Weir',
    ano: 1989,
    genero: 'Drama',
    foto: 'dead-poets-society.jpg',
    favorito: false,
    assistido: false
  },
]


function App() {
  //const [count, setCount] = useState(0) 
  
  //Procura a lista de filmes e, se encontra, recupera os dados. Se não encontra, começa com filmesIniciais 
  const [filmes, setFilmes] = useState(() => {
    const dadosSalvos = localStorage.getItem('filmes')

    if (dadosSalvos) {
      return JSON.parse(dadosSalvos)
    }

    return filmesIniciais
  })

  //Armazena os dados digitados no formulário
  const [titulo, setTitulo] = useState('')
  const [diretor, setDiretor] = useState('')
  const [ano, setAno] = useState('')
  const [genero, setGenero] = useState('')
  const [cartaz, setCartaz] = useState('')
  const [busca, setBusca] = useState('')
  const [filmeEditar, setFilmeEditar] = useState(null)  

  //Efeito para salvar a lista
  useEffect(() => {
    localStorage.setItem('filmes', JSON.stringify(filmes))
  }, [filmes])

  //Adiciona um novo filme e edita um já existente 
  function adicionarFilme() {
    if (filmeEditar === null) { //Se nenhum filme estiver sendo editado, adiciona um novo filme  
      const novoFilme = {
        id: Date.now(),
        titulo: titulo,
        diretor: diretor,
        ano: Number(ano),
        genero: genero,
        foto: cartaz,
        favorito: false,
        assistido: false
    }

    setFilmes([...filmes, novoFilme])
  } else { //Caso contrário, procura o ID do filme e altera os dados
    setFilmes(filmes.map((filme) => { 
      if (filme.id === filmeEditar.id) {
        return {
          ...filme,
          titulo: titulo,
          diretor: diretor,
          ano: Number(ano),
          genero: genero,
          foto: cartaz
        }
      } else { //Se não for o ID do filme correspondente, os dados permanecem da forma que estão.
        return filme
      } 
    }))
  }
  setFilmeEditar(null)
  limparForm()  
  }


  function alternarFavorito(id) {
     console.log('ID clicado:', id)

    setFilmes(filmes.map((filme) => {
      if (filme.id === id) { //Identifica o filme a ser alterado

        if (filme.favorito === false) {  //Verifica se não é favorito
          return {
            ...filme,
            favorito: true //Se não era, passa a ser
          }
        } else {
          return {
            ...filme,
            favorito: false //Se era, passa a não ser mais
          }
        }

      } else {
        return filme //Mantém os filmes não clicados
      }
    }))
  }

  function limparForm() {
    setTitulo('')
    setDiretor('')
    setAno('')
    setGenero('')
    setCartaz('')
  }

//Filtra de acordo com a pesquisa (título, diretor e gênero)
const filmesFiltrados = filmes.filter((filme) =>
  filme.titulo.toLowerCase().includes(busca.toLowerCase()) ||
  filme.diretor.toLowerCase().includes(busca.toLowerCase()) ||
  filme.genero.toLowerCase().includes(busca.toLowerCase())
  ) //to.LowerCase() p/ a pesquisa não depender de letras maiúsculas ou minúsculas


  function mostrarMensagemBusca() {
    if (busca !== '') { // Se o usuário digitou algo na busca 
      if (filmesFiltrados.length === 0) //verifica se tem o filme correspondente
      return <p className="text-texto-secundario text-sm pl-71">Filme não encontrado.</p>
    } else {
      return null // Se encontrou, não exibe a mensagem
    }
  } 

  const listaDeGeneros = filmes.map((filme) => { //Procura somente o gênero de cada filme da lista
    return filme.genero
  })

  const generosSemRepeticao = [...new Set(listaDeGeneros)] // Remove os gêneros repetidos

  const generos = generosSemRepeticao // Guarda a lista sem repetição

  const generosContagem = generos.map((genero) => { //Procura um gênero por vez
  const quantidade = filmes.filter((filme) => { //Conta os filmes do gênero
    if (filme.genero === genero) {  //Verifica se é o correto
      return true //Se for igual, mantém
    } else {
      return false //Se não for, não conta
    }
  }).length 
  
  return {
    genero: genero,
    quantidade: quantidade
  }
})

  function mostrarGeneros() { // Mostra a quantidade de gêneros e cria uma linha p/ cada um
    return generosContagem.map((item) => (
      <div key={item.genero} className="flex items-center justify-between gap-2 border-b border-grafite/50 pb-2">
            <p className="text-[13px]"> {item.genero} </p>
            <p className="text-[11px] text-texto-secundario"> {item.quantidade} </p>
          </div>
      ))
    }

  generosContagem.sort((generoA, generoB) => { //Organiza a ordem
    if (generoA.quantidade < generoB.quantidade) {
      return 1 //A depois de B
    } else {
      if (generoA.quantidade > generoB.quantidade) {
        return -1 //A antes de B
      } else {
        return 0 //Quantidades iguais
      }
    }
  })
  
  function mostrarFavorito(favorito) {
    if (favorito === true) {
      return <img src="fav2.svg" alt="Favoritado" className='w-[20px] pb-6'/>
    } else {
      return <img src="fav.svg" alt="Favoritar" className="w-[20px] pb-6"/>
    }
    }

  //Filtra os filmes favoritos
  const filmesFavoritos = filmes.filter((filme) => {
    if (filme.favorito === true) {
      return true
    } else {
      return false
    }
  })
  
  //Exclui um filme
  function excluirFilme(id) {
    setFilmes(filmes.filter((filme) => {
      if (filme.id !== id) { //Verifica o ID do filme
        return true //Permanece na lista
      } else {
        return false //Remove da lista
      }
    }))
  }
  
  //Edita um filme
  function editarFilme(filme) {
    setFilmeEditar(filme) //Guarda o filme

    //Colocam os atributos atuais nos campos
    setTitulo(filme.titulo)
    setDiretor(filme.diretor)
    setAno(String(filme.ano))
    setGenero(filme.genero)
    setCartaz(filme.foto)
  }


  return (
    <>
    <div className='min-h-screen flex flex-col w-full bg-fundo font-roboto'>

    {/* Cabeçalho */}
      <header className='w-full flex flex-col border-b border-grafite p-5'>
          <nav className='w-full'>
              <ul className='w-full flex gap-8 items-center'>
                <li><img src="logo1.png" alt="logo" className='w-[250px] relative bottom-[3px] right-[15px] '/></li>
              {/* Barra de busca */}
                <li className='flex'>
                  <input type="text" placeholder='Buscar por título, gênero ou diretor...' value={busca} onChange={(e) => setBusca(e.target.value)} 
                  className='w-[800px] h-[30px] placeholder:text-[15px] placeholder:text-texto-secundario text-texto-secundario pl-[9px] pb-[2px] font-light bg-card 
                  border-1 border-grafite rounded-[10px]'/>
                  <button className='-mx-9'><img src="lupa.svg" alt="icon-lupa"/></button>
                </li>
              </ul>
          </nav>
        {mostrarMensagemBusca()}
      </header>

      <main className='text-texto font-light flex flex-1'>

        {/* Primeira coluna */}
        <section className='border-r border-grafite flex w-auto'>
          <ul className='flex flex-col gap-4 m-8'>
            <li className='flex gap-2'>
            <button className="flex gap-2 pr-20 pl-2 py-1 rounded-lg hover:bg-azul transition-colors"><img src="lis.svg" alt="lis"/>Minha lista</button></li>

            <li className='flex gap-2'>
            <button className="flex gap-2 pr-20 pl-2 py-1 rounded-lg hover:bg-azul transition-colors"><img src="fav.svg" alt="fav"/>Favoritos</button></li>

            <li className='flex gap-2'>
            <button className="flex gap-2 pr-20 pl-2 py-1 rounded-lg hover:bg-azul transition-colors"><img src="add.svg" alt="add"/>Adicionar</button></li>

            <li className='flex gap-2'>
            <button className="flex gap-2 pr-20 pl-2 py-1 rounded-lg hover:bg-azul transition-colors"><img src="assist.svg" alt="assist"/>Assistidos</button></li>

            <li className='flex gap-2'>
            <button className="flex gap-2 pr-20 pl-2 py-1 rounded-lg hover:bg-azul transition-colors"><img src="gen.svg" alt="gen"/>Gêneros</button></li>
          </ul>
        </section>

        {/* Segunda coluna */}
        <section className='text-texto mx-10 my-5 flex flex-col w-200'>
          <div className='border-b border-grafite relative'>
            <h1 className="text-[40px] m-8 text-center font-semibold bg-[linear-gradient(to_right,#1b1fef_30%,#1b1fef_29%,#EF801B_31%,#EF801B_48%,#89EF1B_78%,#89EF1B_100%)] bg-clip-text text-transparent">Olá, seja bem-vindo(a)!</h1>
            <h2 className='text-[22px] m-8 -mt-11 text-center'>Explore, adicione e organize seus filmes.</h2>
          </div>

          {/* Formulário */}
          <div>
            {/* Adicionar */}
            <h1 className="flex gap-1 my-5"><img src="add.svg" alt="" />Adicionar filme à lista</h1>
            
          <div className='flex justify-center'> {/* Atributos do formulário */}
              <form className="flex flex-col items-center px-10 gap-5 w-135">
                <input type="text" placeholder="Título do filme" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="bg-fundo border border-grafite rounded-[5px] p-1 w-135"/>

                <input type="text" placeholder="Diretor" value={diretor} onChange={(e) => setDiretor(e.target.value)} className="bg-fundo border border-grafite rounded-[5px] p-1 w-135"/>

                <input type="number" placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} className="bg-fundo border border-grafite rounded-[5px] p-1 w-135"/>

                <input type="text" placeholder="Gênero" value={genero} onChange={(e) => setGenero(e.target.value)} className="bg-fundo border border-grafite rounded-[5px] p-1 w-135"/>

                <input type="url" placeholder="URL do cartaz" value={cartaz} onChange={(e) => setCartaz(e.target.value)} className="bg-fundo border border-grafite rounded-[5px] p-1 w-135"/>

                <div className='flex gap-3 justify-center'>
                  <button type="button" onClick={adicionarFilme} className="bg-azul rounded-[5px] p-2 hover:opacity-90 text-[14px] w-25"> Adicionar </button>
                  <button type="button" onClick={limparForm} className="bg-laranja rounded-[5px] p-2 hover:opacity-90 text-[14px] w-25"> Limpar </button>
                </div>
              </form>
            </div>
          </div>
        <div>

          {/* Minha lista */}
          <h1 className='flex gap-1 my-5'><img src="lis.svg" alt="" />Minha Lista</h1>

            <ul className='flex flex-wrap gap-5 justify-center'>
              {filmesFiltrados.length > 0 ? (
                filmesFiltrados.map((filme) => (  
                <li key={filme.id} className='flex flex-col w-[200px] h-[450px] justify-center items-center bg-card border-1 border-grafite rounded-[10px]'>
                  <img src={filme.foto} alt={filme.titulo}  className='w-[150px] mb-2 mt-6'/>

                  <div className='w-full px-6 py-2 min-h-[140px] flex flex-col gap-1'>
                    <h2 className='font-medium text-[14px]'>{filme.titulo}</h2>
                    <p className='text-[14px]'>{filme.diretor}</p>
                    <p className='text-[12px]'>{filme.ano}</p>
                    <p className='text-[12px]'>{filme.genero}</p>
                  </div>  

                 {/* Botões associados a excluir, editar e favoritar/destacar registro*/}
                  <div className='flex gap-2 justify-center w-[150px] border-t border-grafite pt-2'>
                    {/* '() =>' cria uma função que será executada ('=>' arrow) */}
                    <button type="button" onClick={()=> alternarFavorito(filme.id)}> {mostrarFavorito(filme.favorito)} </button>
                    
                    <button type="button" onClick={() => editarFilme(filme)}> <img src="edit.svg" alt="editar" className='w-[20px] pb-6'/> </button>
                    
                    <button type="button" onClick={() => excluirFilme(filme.id)}> <img src="exc.svg" alt="excluir" className='w-[20px] pb-6'/> </button>
                  </div>
                </li>))
              ):(
                <p className='bg-card border-1 border-grafite p-2 rounded-[10px] mr-130'>Você ainda não adicionou esse filme.</p>
              )} {/* Operador (? :), que funciona como um 'if/else' */}
            </ul>
          </div>
          
          
          {/* Favoritos */}
          <div>
            <h1 className='flex gap-1 my-5'><img src="fav.svg" alt="" />Meus Favoritos</h1>

            <ul className='flex flex-wrap gap-5 items-start'>
              {filmesFavoritos.length > 0 ? (
                filmesFavoritos.map((filme) => (  
                <li key={filme.id} className='flex flex-col w-[200px] h-[450px] justify-center items-center bg-card border-1 border-grafite rounded-[10px]'>
                  <img src={filme.foto} alt={filme.titulo} className='w-[150px] mb-2 mt-6'/>

                  <div className='w-full px-6 py-2 min-h-[140px]'>
                    <h2 className='font-medium text-[16px]'>{filme.titulo}</h2>
                    <p className='text-[14px]'>Dirigido por {filme.diretor}</p>
                    <p className='text-[12px]'>{filme.ano}</p>
                  </div>

                  {/* Botões associados a excluir, editar e favoritar/destacar registro*/}
                  <div className='flex gap-2 justify-center w-[100px] border-t border-grafite pt-2'>
                    <button type="button" onClick={() => alternarFavorito(filme.id)}>
                      {mostrarFavorito(filme.favorito)} </button> 
                    
                    <button type="button" onClick={() => editarFilme(filme)}> <img src="edit.svg" alt="editar" className='w-[20px] pb-6'/> </button> 

                    <button type="button" onClick={() => excluirFilme(filme.id)}> <img src="exc.svg" alt="excluir" className='w-[20px] pb-6'/> </button>
                  </div>
                </li>))
              ) : (
                <p className='bg-card border-1 border-grafite p-2 rounded-[10px]'>Você ainda não adicionou nenhum filme aos favoritos!</p>
              )}
            </ul>
          </div>

        </section>


        {/* Terceira coluna */}
        <section className='text-texto border-l border-grafite flex flex-col flex-1'>

          {/* Usuário */}
          <div className='bg-card border-1 border-grafite m-8 p-4 flex gap-5 items-center justify-center rounded-[10px]'>
              <img src="user.svg" alt="" className='w-[80px]'/>
              <div className='flex flex-col'>
                <h2>Usuário</h2>
                <p className='text-[12px] text-texto-secundario'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit soluta reprehenderit in voluptas, dolorum voluptate. </p>
              </div>
          </div>

          {/* Lista */}  
          <div className='bg-card border-1 border-grafite m-8 p-4 flex flex-col gap-4 rounded-[10px]'>
            <h2 className='flex gap-3 items-center'> <img src="barras.svg" alt="" className='w-[20px]'/> Gêneros mais cadastrados</h2>
            {mostrarGeneros()}
          </div>       
        </section>
      </main>

      <footer>
        <div className='text-[#ffffffe0] text-[10px] flex justify-center p-5 border-t border-grafite font-light'>
          <p>My Watchlist • Desenvolvido por <strong>Yasmin Saraya</strong> • &copy; 2026</p>
        </div>
      </footer>
      
    </div>
    </>
  )
}

export default App
