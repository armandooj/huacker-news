var app = angular.module('huackerNews', ['ui.router']);

// Declare a posts service
app.factory('posts', [
'$http',
function($http) {
    var o = {
        posts: []
    };
    o.get = function(id) {
        return $http.get('/posts/' + id).then(function(res) {
            return res.data;
        });
    };
    o.getAll = function() {
        return $http.get('/posts').then(function(res) {
            // Create a deep copy so that $scope.posts is also updated
            angular.copy(res.data, o.posts);
        });
    };
    o.create = function(post) {
        return $http.post('/posts', post).then(function(res) {
            o.posts.push(res.data);
        });
    };
    o.upvote = function(post) {
        return $http.put('/posts/' + post._id + '/upvote').then(function(res) {
            post.upvotes += 1;
        });
    };
    o.addComment = function(id, comment) {
        return $http.post('/posts/' + id + '/comments', comment);
    };
    o.upvoteComment = function(post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
        .then(function(data) {
            comment.upvotes += 1;
        });
    };
    return o;
}]);

app.controller('MainCtrl', [
'$scope',
'posts', // Injecting the service
function($scope, posts) {
    $scope.posts = posts.posts;
    
    $scope.addPost = function() {
        if (!$scope.title || $scope.title === '') {
            return; 
        }
        posts.create({
            title: $scope.title,
            link: $scope.link,
        });
        $scope.title = '';
        $scope.link = '';
    };
    $scope.incrementUpvotes = function(post) {
        posts.upvote(post);
    }  
}]);

app.controller('PostsCtrl', [
'$scope', 'posts', 'post',
function($scope, posts, post) {  
    $scope.post = post;

    $scope.addComment = function() {
        if ($scope.body === '') {
            return;
        }
        posts.addComment(post._id, {
            author: 'user',
            body: $scope.body,
        }).then(function(res) {
            $scope.post.comments.push(res.data);
        });
        $scope.body = '';
    };

    $scope.incrementUpvotes = function(comment) {
        posts.upvoteComment(post, comment);
    }
}]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/index.html',
            controller: 'MainCtrl',
            resolve: {
                postPromise: ['posts', function(posts) {
                    return posts.getAll();
                }]
            }
        })
        .state('posts', {
            url: '/posts/{id}',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl',
            resolve: {
                post: ['$stateParams', 'posts', function($stateParams, posts) {
                    return posts.get($stateParams.id);
                }]
            }
        });

        $urlRouterProvider.otherwise('home');
    }
]);
