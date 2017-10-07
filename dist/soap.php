<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class WebService {
  protected $url = "http://ws.globalbus.com.br/wservice.asmx?wsdl";
  protected $method = "POST";
  protected $encoding = "UTF-8";
  protected $usuario = "appjal";
  protected $senha = "appjal2017/*";
  
  public function __construct(){
    if(isset($_GET["op"])){
      $this->{$_GET["op"]}();
    } else {
      $client = $this->getSoapClient();
      echo json_encode($client);
      die();
    }
  }
  public function listaVeiculoGaragem(){
    $client = $this->_getSoapClient();
    $response = $client->ListaVeiculoGaragem(array("Id_Config"=>2));
    echo json_encode($response);
    die();
  }
  public function listaLinhasCliente(){
    if (isset($_GET["clientId"]) && $_GET["clientId"] > 0){
      $client = $this->_getSoapClient();
      $response = $client->ListaLinhasCliente(array("Id_Config" => 2, "Cliente" => $_GET["clientId"]));
      echo json_encode($response);
    } else {
      echo json_encode(array("result" => "ID do cliente não fornecida."));
    }
    die();
  }
  public function listaClientesPorUsuario(){
    $client = $this->_getSoapClient();
    $response = $client->ListaClientesPorUsuario(array("Id_Config"=>2, "Usuario"=>$this->_getUsuario(), "Senha"=>$this->_getSenha()));
    echo json_encode($response);
    die();
  }
  public function listRotasLinha(){
    $client = $this->_getSoapClient();
    $response = $client->ListRotasLinha(array("Id_Config"=>2, "Linha"=>"string"));
    echo json_encode($response);
    die();
  }
  public function listaPontosReferenciaRota(){
    $client = $this->_getSoapClient();
    $response = $client->ListaPontosReferenciaRota(array("Id_Config"=>2, "Rota"=>"string"));
    echo json_encode($response);
    die();
  }
  public function listaTrajetosCliente(){
    $client = $this->_getSoapClient();
    $response = $client->ListaTrajetosCliente(array("Id_Config"=>2, "Cliente"=>"string"));
    echo json_encode($response);
    die();
  }
  public function listaVeiculosProximos(){
    $client = $this->_getSoapClient();
    $response = $client->ListaVeiculosProximos(array("Id_Config"=>2, "Latitude"=>"double", "Longitude"=>"double"));
    echo json_encode($response);
    die();
  }
  public function listaVeiculosTrajeto(){
    $client = $this->_getSoapClient();
    $response = $client->ListaVeiculosTrajeto(array("Id_Config"=>2, "Id_Linha"=>"string", "Id_Rota"=>"string", "Latitude"=>"double", "Longitude"=>"double", "QuantidadeVeiculos"=>"string", "QuantidadePontos"=>"string"));
    echo json_encode($response);
    die();
  }
  private function _getSoapClient(){
    return new SoapClient($this->url, array(
        "encoding" => $this->encoding,
        "method"   => $this->method
    ));
  }
  private function _getUsuario(){
    return $this->usuario;
  }
  private function _getSenha(){
    return $this->senha;
  }
}

$webservice = new WebService();